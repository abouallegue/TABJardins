import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductImage } from '@/components/ProductImage'
import { RichText } from '@/components/RichText'
import { asMedia } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

// Les pages libres et les articles de conseils partagent la racine du site,
// comme sur l'ancien WordPress (ex. /notre-entreprise/, /chrysanthemes-dautomne-…/).
const resolve = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const page = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  if (page.docs[0]) return { kind: 'page' as const, doc: page.docs[0] }
  const post = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  if (post.docs[0]) return { kind: 'post' as const, doc: post.docs[0] }
  return null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve((await params).slug)
  if (!found) return {}
  const { doc } = found
  return {
    title: doc.seo?.metaTitle || doc.title,
    description: doc.seo?.metaDescription || ('excerpt' in doc ? doc.excerpt : undefined) || undefined,
    alternates: { canonical: `/${doc.slug}` },
  }
}

const dateFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

export default async function SlugPage({ params }: Props) {
  const found = await resolve((await params).slug)
  if (!found) notFound()

  const { kind, doc } = found
  const image = asMedia(kind === 'page' ? doc.heroImage : doc.cover)
  const crumbs =
    kind === 'post'
      ? [{ label: 'Tout sur son jardin', href: '/tout-sur-son-jardin' }, { label: doc.title }]
      : [{ label: doc.title }]

  return (
    <article className="container-page py-8">
      <Breadcrumbs items={crumbs} />
      <header className="mx-auto mt-6 max-w-3xl">
        {kind === 'post' && doc.publishedAt && (
          <p className="text-sm text-muted">{dateFmt.format(new Date(doc.publishedAt))}</p>
        )}
        <h1 className="mt-1 text-4xl font-bold md:text-5xl">{doc.title}</h1>
      </header>
      {image && (
        <div className="relative mx-auto mt-8 aspect-[21/9] max-w-5xl overflow-hidden rounded-3xl">
          <ProductImage image={image} title={doc.title} sizes="100vw" priority />
        </div>
      )}
      <div className="mx-auto mt-8 max-w-3xl">
        <RichText data={doc.content} />
      </div>
    </article>
  )
}
