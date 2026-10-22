import Link from 'next/link'

import { categoryHref, getCategoryTree, type CategoryNode } from '@/lib/categories'
import { getPayloadClient } from '@/lib/payload'
import { CartLink } from './cart/CartLink'

function Dropdown({ root }: { root: CategoryNode }) {
  return (
    <div className="group relative">
      <Link href={categoryHref(root)} className="flex items-center gap-1 py-3 hover:text-leaf">
        {root.title}
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </Link>
      {root.children.length > 0 && (
        <div className="invisible absolute left-0 top-full z-30 w-64 rounded-xl border border-line bg-white p-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
          {root.children.map((child) => (
            <Link
              key={child.id}
              href={categoryHref(child)}
              className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-leaf-light"
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export async function Header() {
  const payload = await getPayloadClient()
  const [tree, settings] = await Promise.all([getCategoryTree(), payload.findGlobal({ slug: 'settings' })])

  const links = [
    { href: '/promo', label: 'Promotions' },
    { href: '/tout-sur-son-jardin', label: 'Conseils' },
    { href: '/notre-entreprise', label: 'Notre entreprise' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      {settings.announcement && (
        <div className="bg-forest px-4 py-2 text-center text-sm text-white">{settings.announcement}</div>
      )}
      <div className="container-page flex items-center gap-4 py-3">
        <Link href="/" className="flex shrink-0 flex-col leading-tight">
          <span className="font-display text-2xl font-bold text-forest">TAB Jardins</span>
          <span className="text-xs text-muted">Pépinière &amp; motoculture · Étampes</span>
        </Link>

        <form action="/recherche" className="ml-auto hidden max-w-sm flex-1 md:block">
          <label className="sr-only" htmlFor="q">
            Rechercher
          </label>
          <input id="q" name="q" type="search" placeholder="Rechercher un produit…" className="field rounded-full" />
        </form>

        {settings.phone && (
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hidden text-sm font-semibold text-forest lg:block">
            {settings.phone}
          </a>
        )}
        <div className="ml-auto md:ml-0">
          <CartLink />
        </div>
      </div>

      {/* Navigation bureau */}
      <nav className="hidden border-t border-line md:block" aria-label="Navigation principale">
        <div className="container-page flex items-center gap-7 text-sm font-semibold text-forest">
          {tree.map((root) => (
            <Dropdown key={root.id} root={root} />
          ))}
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="py-3 hover:text-leaf">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Navigation mobile, sans JavaScript */}
      <details className="border-t border-line md:hidden">
        <summary className="container-page cursor-pointer list-none py-3 text-sm font-semibold text-forest">
          ☰ Menu
        </summary>
        <div className="container-page space-y-4 pb-4">
          <form action="/recherche">
            <input name="q" type="search" placeholder="Rechercher un produit…" className="field" aria-label="Rechercher" />
          </form>
          {tree.map((root) => (
            <div key={root.id}>
              <Link href={categoryHref(root)} className="font-semibold text-forest">
                {root.title}
              </Link>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {root.children.map((c) => (
                  <Link key={c.id} href={categoryHref(c)} className="py-1 text-sm text-ink">
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="grid gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="font-semibold text-forest">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </details>
    </header>
  )
}
