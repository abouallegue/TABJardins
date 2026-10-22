import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductImage } from '@/components/ProductImage'
import { asMedia } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Tout sur son jardin',
  description: 'Conseils de plantation et d’entretien par les pépiniéristes de TAB Jardins.',
  alternates: { canonical: '/tout-sur-son-jardin' },
}

const dateFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

export default async function PostsPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'posts', limit: 50, depth: 1, overrideAccess: false })
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Tout sur son jardin' }]} />
      <h1 className="mt-4 text-4xl font-bold">Tout sur son jardin</h1>
      <p className="mt-2 text-muted">Nos conseils de saison pour planter, entretenir et réussir votre jardin.</p>
      {docs.length === 0 ? (
        <p className="mt-8 rounded-xl bg-white p-8 text-center text-muted">Les premiers conseils arrivent bientôt.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((post) => (
            <Link key={post.id} href={`/${post.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative aspect-[16/10]">
                <ProductImage image={asMedia(post.cover)} title={post.title} sizes="33vw" />
              </div>
              <div className="p-5">
                {post.publishedAt && <p className="text-xs text-muted">{dateFmt.format(new Date(post.publishedAt))}</p>}
                <h2 className="mt-1 text-xl font-bold group-hover:text-forest">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-muted">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
