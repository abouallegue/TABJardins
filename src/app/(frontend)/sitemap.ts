import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const payload = await getPayloadClient()
  const opts = { limit: 5000, depth: 0, pagination: false, overrideAccess: false } as const
  const [products, categories, pages, posts] = await Promise.all([
    payload.find({ collection: 'products', ...opts, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'categories', ...opts, select: { path: true, updatedAt: true } }),
    payload.find({ collection: 'pages', ...opts, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'posts', ...opts, select: { slug: true, updatedAt: true } }),
  ])
  const fixed = ['', '/nos-produits', '/promo', '/tout-sur-son-jardin', '/contact', '/avis-clients']
  return [
    ...fixed.map((p) => ({ url: `${base}${p}` })),
    ...categories.docs.map((c) => ({ url: `${base}/categorie-produit/${c.path}`, lastModified: c.updatedAt })),
    ...products.docs.map((p) => ({ url: `${base}/produit/${p.slug}`, lastModified: p.updatedAt })),
    ...pages.docs.map((p) => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt })),
    ...posts.docs.map((p) => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt })),
  ]
}
