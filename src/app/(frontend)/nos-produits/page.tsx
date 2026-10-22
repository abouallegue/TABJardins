import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductImage } from '@/components/ProductImage'
import { categoryHref, getCategoryTree } from '@/lib/categories'
import { asMedia } from '@/lib/media'

export const revalidate = 60
export const metadata: Metadata = { title: 'Nos produits', alternates: { canonical: '/nos-produits' } }

export default async function ProductsIndexPage() {
  const tree = await getCategoryTree()
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Nos produits' }]} />
      <h1 className="mt-4 text-4xl font-bold">Nos produits</h1>
      {tree.map((root) => (
        <section key={root.id} className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">{root.title}</h2>
            <Link href={categoryHref(root)} className="text-sm font-semibold text-forest underline">
              Tout voir
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {root.children.map((c) => (
              <Link key={c.id} href={categoryHref(c)} className="group overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-[4/3]">
                  <ProductImage image={asMedia(c.image)} title={c.title} sizes="25vw" />
                </div>
                <p className="p-4 font-semibold group-hover:text-forest">{c.title}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
