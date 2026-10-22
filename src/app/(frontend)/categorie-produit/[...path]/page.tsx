import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { CatalogFilters } from '@/components/CatalogFilters'
import { Pagination } from '@/components/Pagination'
import { ProductGrid } from '@/components/ProductCard'
import { RichText } from '@/components/RichText'
import { findProducts, type SearchParams } from '@/lib/catalog'
import { categoryHref, descendantIds, findByPath, getCategoryTree, type CategoryNode } from '@/lib/categories'

type Props = { params: Promise<{ path: string[] }>; searchParams: Promise<SearchParams> }

async function load(path: string[]) {
  const tree = await getCategoryTree()
  const category = findByPath(tree, path.map(decodeURIComponent).join('/'))
  return { tree, category }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await load((await params).path)
  if (!category) return {}
  return {
    title: category.seo?.metaTitle || category.title,
    description: category.seo?.metaDescription || category.tagline || undefined,
    alternates: { canonical: categoryHref(category) },
  }
}

const ancestors = (tree: CategoryNode[], target: CategoryNode): Crumb[] => {
  const walk = (nodes: CategoryNode[], trail: CategoryNode[]): CategoryNode[] | null => {
    for (const n of nodes) {
      if (n.id === target.id) return [...trail, n]
      const found = walk(n.children, [...trail, n])
      if (found) return found
    }
    return null
  }
  return (walk(tree, []) ?? [target]).map((n) => ({ label: n.title, href: categoryHref(n) }))
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { path } = await params
  const query = await searchParams
  const { tree, category } = await load(path)
  if (!category) notFound()

  const isPlants = category.path?.startsWith('vegetaux') ?? false
  const result = await findProducts({
    where: { categories: { in: descendantIds(category) } },
    params: query,
    withPlantFilters: isPlants,
  })
  const basePath = categoryHref(category)

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={ancestors(tree, category)} />

      <header className="mt-4 max-w-3xl">
        <h1 className="text-4xl font-bold">{category.title}</h1>
        {category.tagline && <p className="mt-2 text-lg text-muted">{category.tagline}</p>}
      </header>

      {category.children.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {category.children.map((c) => (
            <Link key={c.id} href={categoryHref(c)} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm hover:border-leaf">
              {c.title}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <CatalogFilters basePath={basePath} params={query} showPlantFilters={isPlants} />
        </aside>
        <section>
          <p className="mb-4 text-sm text-muted">
            {result.totalDocs} produit{result.totalDocs > 1 ? 's' : ''}
          </p>
          <ProductGrid products={result.docs} />
          <Pagination basePath={basePath} params={query} page={result.page ?? 1} totalPages={result.totalPages} />
        </section>
      </div>

      {(category.intro || category.faq?.length) && (
        <section className="mt-16 grid gap-10 rounded-3xl bg-white p-8 lg:grid-cols-2">
          {category.intro && <RichText data={category.intro} />}
          {category.faq?.length ? (
            <div>
              <h2 className="text-2xl font-bold">Questions fréquentes</h2>
              <div className="mt-4 divide-y divide-line">
                {category.faq.map((f) => (
                  <details key={f.id} className="py-3">
                    <summary className="cursor-pointer font-semibold">{f.question}</summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{f.answer}</p>
                  </details>
                ))}
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: category.faq.map((f) => ({
                      '@type': 'Question',
                      name: f.question,
                      acceptedAnswer: { '@type': 'Answer', text: f.answer },
                    })),
                  }),
                }}
              />
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}
