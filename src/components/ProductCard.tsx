import Link from 'next/link'

import type { Product } from '@/payload-types'
import { asMedia } from '@/lib/media'
import { isOnSale } from '@/lib/price'
import { PriceRange } from './Price'
import { ProductImage } from './ProductImage'

export function ProductCard({ product }: { product: Product }) {
  const image = asMedia(product.images?.[0])
  const onSale = isOnSale(product)
  const outOfStock = !product.variants?.length && product.stock === 'out_of_stock'
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductImage image={image} title={product.title} sizes="(min-width: 1024px) 25vw, 50vw" />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {onSale && <span className="rounded-full bg-sale px-2 py-0.5 text-xs font-semibold text-white">Promo</span>}
          {outOfStock && (
            <span className="rounded-full bg-ink/70 px-2 py-0.5 text-xs font-semibold text-white">Épuisé</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && <span className="text-xs uppercase tracking-wide text-muted">{product.brand}</span>}
        <h3 className="font-sans text-sm font-semibold leading-snug text-ink group-hover:text-forest">
          {product.title}
        </h3>
        <div className="mt-auto">
          <PriceRange product={product} />
        </div>
      </div>
    </Link>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p className="rounded-xl bg-white p-8 text-center text-muted">Aucun produit pour le moment.</p>
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
