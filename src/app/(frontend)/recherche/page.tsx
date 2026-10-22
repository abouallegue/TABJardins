import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { ProductGrid } from '@/components/ProductCard'
import { findProducts, type SearchParams } from '@/lib/catalog'

export const metadata: Metadata = { title: 'Recherche', robots: { index: false } }

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q.trim() : ''
  const result = q
    ? await findProducts({
        where: { or: [{ title: { like: q } }, { brand: { like: q } }, { sku: { equals: q } }] },
        params,
      })
    : null
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Recherche' }]} />
      <h1 className="mt-4 text-4xl font-bold">Recherche</h1>
      <form className="mt-6 flex max-w-xl gap-2">
        <input name="q" type="search" defaultValue={q} className="field" placeholder="Pommier, tondeuse, rosier…" aria-label="Rechercher" />
        <button className="btn-primary">Rechercher</button>
      </form>
      {result && (
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted">
            {result.totalDocs} résultat{result.totalDocs > 1 ? 's' : ''} pour « {q} »
          </p>
          <ProductGrid products={result.docs} />
          <Pagination basePath="/recherche" params={params} page={result.page ?? 1} totalPages={result.totalPages} />
        </div>
      )}
    </div>
  )
}
