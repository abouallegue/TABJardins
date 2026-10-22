import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { NewsletterForm } from './forms/NewsletterForm'

export async function Footer() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'settings' })

  return (
    <footer className="mt-16 bg-forest-dark text-white/85">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold text-white">TAB Jardins</p>
          <p className="mt-2 text-sm">Votre partenaire vert depuis 1987.</p>
          {settings.address && <p className="mt-4 whitespace-pre-line text-sm">{settings.address}</p>}
          {settings.mapUrl && (
            <a href={settings.mapUrl} className="mt-2 inline-block text-sm underline" target="_blank" rel="noreferrer">
              Voir sur la carte
            </a>
          )}
        </div>

        <div>
          <p className="font-semibold text-white">Horaires</p>
          {settings.openingHours?.length ? (
            <dl className="mt-3 space-y-1 text-sm">
              {settings.openingHours.map((line) => (
                <div key={line.id} className="flex justify-between gap-4">
                  <dt>{line.days}</dt>
                  <dd className="text-right">{line.hours}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-sm">À renseigner dans le back-office.</p>
          )}
        </div>

        <div>
          <p className="font-semibold text-white">Nous contacter</p>
          <ul className="mt-3 space-y-1 text-sm">
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            <li>
              <Link href="/contact" className="underline">
                Formulaire de contact
              </Link>
            </li>
            <li>
              <Link href="/avis-clients" className="underline">
                Avis clients
              </Link>
            </li>
          </ul>
          <div className="mt-4 flex gap-4 text-sm">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="underline">
                Facebook
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="underline">
                Instagram
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">Newsletter</p>
          <p className="mt-3 text-sm">Nouveautés, promotions et conseils de saison.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap gap-x-6 gap-y-2 py-4 text-xs text-white/60">
          <span>© {new Date().getFullYear()} TAB Jardins</span>
          <Link href="/mention-legales">Mentions légales</Link>
          <Link href="/cgv">CGV</Link>
          <Link href="/pepiniere-etampes">Pépinière à Étampes</Link>
        </div>
      </div>
    </footer>
  )
}
