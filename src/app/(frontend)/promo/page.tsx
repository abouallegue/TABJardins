import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductGrid } from '@/components/ProductCard'
import { getPayloadClient } from '@/lib/payload'
import { isOnSale } from '@/lib/price'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Promotions',
  description: 'Les promotions du moment chez TAB Jardins : végétaux et motoculture.',
  alternates: { canonical: '/promo' },
}

export default async function PromoPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { or: [{ salePrice: { exists: true } }, { 'variants.salePrice': { exists: true } }] },
    limit: 200,
    depth: 1,
    overrideAccess: false,
  })
  const products = docs.filter((p) => isOnSale(p))
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Promotions' }]} />
      <h1 className="mt-4 text-4xl font-bold">Promotions</h1>
      <p className="mt-2 text-muted">Offres valables dans la limite des stocks disponibles.</p>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
