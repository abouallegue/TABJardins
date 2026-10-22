import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ContactForm } from '@/components/forms/ContactForm'
import { contactSubjects } from '@/collections/ContactMessages'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez TAB Jardins à Étampes : conseils, produits non référencés, réparation de motoculture.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ objet?: string }> }) {
  const { objet } = await searchParams
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'settings' })
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <h1 className="mt-4 text-4xl font-bold">Contactez-nous</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white p-6 md:p-8">
          <ContactForm subjects={contactSubjects} defaultSubject={objet} />
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl bg-leaf-light p-6">
            <h2 className="font-sans text-base font-bold">Le magasin</h2>
            {settings.address && <p className="mt-2 whitespace-pre-line text-sm">{settings.address}</p>}
            {settings.phone && (
              <p className="mt-2 text-sm">
                Tél. <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="font-semibold">{settings.phone}</a>
              </p>
            )}
            {settings.email && (
              <p className="text-sm">
                <a href={`mailto:${settings.email}`} className="underline">{settings.email}</a>
              </p>
            )}
          </div>
          {settings.openingHours?.length ? (
            <div className="rounded-2xl bg-white p-6">
              <h2 className="font-sans text-base font-bold">Horaires</h2>
              <dl className="mt-2 space-y-1 text-sm">
                {settings.openingHours.map((l) => (
                  <div key={l.id} className="flex justify-between gap-4">
                    <dt>{l.days}</dt>
                    <dd>{l.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
