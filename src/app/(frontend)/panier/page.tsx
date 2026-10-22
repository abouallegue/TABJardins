import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CartView } from '@/components/cart/CartView'

export const metadata: Metadata = { title: 'Mon panier', robots: { index: false } }

export default function CartPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Panier' }]} />
      <h1 className="mt-4 mb-8 text-4xl font-bold">Mon panier</h1>
      <CartView />
    </div>
  )
}
