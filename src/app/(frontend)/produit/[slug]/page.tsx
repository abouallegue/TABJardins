import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { AddToCart, type PurchaseOption } from '@/components/cart/AddToCart'
import { ProductGrid } from '@/components/ProductCard'
import { ProductImage } from '@/components/ProductImage'
import { RichText } from '@/components/RichText'
import type { Category, Product } from '@/payload-types'
import { categoryHref } from '@/lib/categories'
import { asMedia } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { labelFor, plantAttributes, type PlantAttributeKey } from '@/lib/plantAttributes'
import { priceFor, priceRange } from '@/lib/price'

type Props = { params: Promise<{ slug: string }> }

const getProduct = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })
  return docs[0]
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug)
  if (!product) return {}
  const image = asMedia(product.images?.[0])
  return {
    title: product.seo?.metaTitle || product.title,
    description: product.seo?.metaDescription || product.shortDescription || undefined,
    alternates: { canonical: `/produit/${product.slug}` },
    openGraph: image?.url ? { images: [image.url] } : undefined,
  }
}

const plantKeys = Object.keys(plantAttributes) as PlantAttributeKey[]

type Row = { label: string; value: string }

function plantRows(product: Product): Row[] {
  const plant = (product.plant ?? {}) as Partial<Record<PlantAttributeKey, string | string[] | null>>
  return plantKeys
    .map((key) => {
      const raw = plant[key]
      const values = Array.isArray(raw) ? raw : raw ? [raw] : []
      if (!values.length) return null
      const row: Row = { label: plantAttributes[key].label, value: values.map((v) => labelFor(key, v)).join(', ') }
      return row
    })
    .filter((r): r is Row => r !== null)
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug)
  if (!product) notFound()

  const images = (product.images ?? []).map(asMedia).filter((m) => m !== null)
  const categories = (product.categories ?? []).filter((c): c is Category => typeof c === 'object')
  const mainCategory = categories.find((c) => c.parent) ?? categories[0]
  const related = (product.related ?? []).filter((p): p is Product => typeof p === 'object' && p.visible !== false)

  const hasVariants = Boolean(product.variants?.length)
  const options: PurchaseOption[] = hasVariants
    ? product.variants!.map((v) => {
        const p = priceFor(product, v)
        return { label: v.label, price: p?.price ?? null, regular: p?.regular ?? null, stock: v.stock ?? 'in_stock' }
      })
    : [
        {
          price: priceFor(product)?.price ?? null,
          regular: priceFor(product)?.regular ?? null,
          stock: product.stock ?? 'in_stock',
        },
      ]

  const specs = [...plantRows(product), ...(product.specs ?? []).map((s) => ({ label: s.label, value: s.value }))]
  const range = priceRange(product)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription ?? undefined,
    image: images.map((i) => i.url),
    sku: product.sku ?? undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: range
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: range.min,
          highPrice: range.max,
          availability:
            product.stock === 'out_of_stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        }
      : undefined,
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          ...(mainCategory ? [{ label: mainCategory.title, href: categoryHref(mainCategory) }] : []),
          { label: product.title },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
            <ProductImage image={images[0]} title={product.title} sizes="(min-width: 1024px) 50vw, 100vw" priority />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl bg-white">
                  <ProductImage image={img} title={product.title} sizes="25vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && <p className="text-sm uppercase tracking-wide text-muted">{product.brand}</p>}
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">{product.title}</h1>
          {product.shortDescription && <p className="mt-4 leading-relaxed text-muted">{product.shortDescription}</p>}
          <div className="mt-6 rounded-2xl border border-line bg-white p-6">
            <AddToCart
              productId={product.id}
              slug={product.slug ?? ''}
              title={product.title}
              image={images[0]?.sizes?.thumbnail?.url ?? images[0]?.url ?? undefined}
              variantLabel={product.variantLabel}
              options={options}
              hasVariants={hasVariants}
            />
          </div>
          {product.sku && <p className="mt-3 text-xs text-muted">Réf. {product.sku}</p>}
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {product.description && (
          <section>
            <h2 className="text-2xl font-bold">Description</h2>
            <RichText data={product.description} className="mt-3" />
          </section>
        )}
        {specs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold">Caractéristiques</h2>
            <table className="mt-4 w-full overflow-hidden rounded-xl bg-white text-sm">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <th className="w-1/2 px-4 py-2.5 text-left font-semibold">{s.label}</th>
                    <td className="px-4 py-2.5 text-muted">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Vous aimerez aussi</h2>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}
