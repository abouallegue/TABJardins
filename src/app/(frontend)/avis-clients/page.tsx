import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60
export const metadata: Metadata = { title: 'Avis clients', alternates: { canonical: '/avis-clients' } }

const sources: Record<string, string> = { google: 'Avis Google', facebook: 'Avis Facebook', magasin: 'En magasin' }

export default async function ReviewsPage() {
  const payload = await getPayloadClient()
  const [{ docs }, settings] = await Promise.all([
    payload.find({ collection: 'testimonials', limit: 100 }),
    payload.findGlobal({ slug: 'settings' }),
  ])
  const average = docs.length ? docs.reduce((s, t) => s + (t.rating ?? 5), 0) / docs.length : null
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Avis clients' }]} />
      <h1 className="mt-4 text-4xl font-bold">Avis clients</h1>
      {average !== null && (
        <p className="mt-2 text-muted">
          <span className="text-amber-500">★</span> {average.toFixed(1).replace('.', ',')} / 5 sur {docs.length} avis
        </p>
      )}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((t) => (
          <blockquote key={t.id} className="rounded-2xl bg-white p-6">
            <p className="text-amber-500" aria-label={`${t.rating ?? 5} sur 5`}>{'★'.repeat(t.rating ?? 5)}</p>
            <p className="mt-3 leading-relaxed">« {t.text} »</p>
            <footer className="mt-3 text-sm">
              <span className="font-semibold text-forest">{t.author}</span>
              <span className="text-muted"> · {sources[t.source ?? 'google']}</span>
            </footer>
          </blockquote>
        ))}
      </div>
      {settings.googleReviews && (
        <a href={settings.googleReviews} target="_blank" rel="noreferrer" className="btn-primary mt-8">
          Laisser un avis sur Google
        </a>
      )}
    </div>
  )
}
