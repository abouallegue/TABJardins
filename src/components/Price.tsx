import type { Product } from '@/payload-types'
import { formatPrice, priceRange } from '@/lib/price'

export function PriceRange({ product, className = '' }: { product: Product; className?: string }) {
  const range = priceRange(product)
  if (!range) return <span className={`text-sm text-muted ${className}`}>Prix en magasin</span>
  const label =
    range.min === range.max ? formatPrice(range.min) : `${formatPrice(range.min)} – ${formatPrice(range.max)}`
  return (
    <span className={`font-semibold ${range.onSale ? 'text-sale' : 'text-forest'} ${className}`}>
      {range.min !== range.max && <span className="sr-only">De </span>}
      {label}
    </span>
  )
}
