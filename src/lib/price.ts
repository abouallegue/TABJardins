import type { Product } from '@/payload-types'

type Variant = NonNullable<Product['variants']>[number]

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export const formatPrice = (value: number): string => euro.format(value)

export const isSaleActive = (product: Pick<Product, 'saleStart' | 'saleEnd'>, now = new Date()): boolean => {
  if (product.saleStart && new Date(product.saleStart) > now) return false
  if (product.saleEnd && new Date(product.saleEnd) < now) return false
  return true
}

export type PriceInfo = { price: number; regular: number | null }

// Prix réellement appliqué (promo comprise) pour le produit ou l'une de ses options.
export const priceFor = (product: Product, variant?: Variant | null): PriceInfo | null => {
  const base = variant?.price ?? product.price
  if (base == null) return null
  const sale = variant ? variant.salePrice : product.salePrice
  if (sale != null && sale < base && isSaleActive(product)) return { price: sale, regular: base }
  return { price: base, regular: null }
}

// Fourchette de prix affichée dans les listes (« 369,00 € – 499,00 € »).
export const priceRange = (product: Product): { min: number; max: number; onSale: boolean } | null => {
  const infos = product.variants?.length
    ? product.variants.map((v) => priceFor(product, v))
    : [priceFor(product)]
  const prices = infos.filter((p): p is PriceInfo => p !== null)
  if (!prices.length) return null
  return {
    min: Math.min(...prices.map((p) => p.price)),
    max: Math.max(...prices.map((p) => p.price)),
    onSale: prices.some((p) => p.regular !== null),
  }
}

export const isOnSale = (product: Product): boolean => priceRange(product)?.onSale ?? false

export const stockLabels: Record<string, string> = {
  in_stock: 'En stock',
  on_order: 'Sur commande',
  out_of_stock: 'Rupture de stock',
}
