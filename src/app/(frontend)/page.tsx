import Link from 'next/link'

import { ProductGrid } from '@/components/ProductCard'
import { ProductImage } from '@/components/ProductImage'
import type { Category } from '@/payload-types'
import { categoryHref, getCategoryTree } from '@/lib/categories'
import { asMedia } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [home, settings, tree, featured, testimonials] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1 }),
    payload.findGlobal({ slug: 'settings' }),
    getCategoryTree(),
    payload.find({ collection: 'products', where: { featured: { equals: true } }, limit: 8, depth: 1, overrideAccess: false }),
    payload.find({ collection: 'testimonials', limit: 3 }),
  ])

  const heroImage = asMedia(home.hero?.image)
  const featuredCategories = (home.featuredCategories ?? []).filter((c): c is Category => typeof c === 'object')
  const shownCategories = featuredCategories.length ? featuredCategories : tree.flatMap((r) => r.children).slice(0, 8)

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        {heroImage && (
          <div className="absolute inset-0 opacity-40">
            <ProductImage image={heroImage} title="" sizes="100vw" priority />
          </div>
        )}
        <div className="container-page relative py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-leaf-light">Pépinière familiale depuis 1987</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold text-white md:text-6xl">
            {home.hero?.title || 'Votre partenaire vert à Étampes'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            {home.hero?.subtitle ||
              'Arbres, arbustes, fruitiers, rosiers et vivaces cultivés avec soin, matériel de motoculture : vente, réparation et révision.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {tree.map((root) => (
              <Link key={root.id} href={categoryHref(root)} className="btn bg-white text-forest hover:bg-leaf-light">
                {root.title}
              </Link>
            ))}
            <Link href="/promo" className="btn border border-white/60 text-white hover:bg-white/10">
              Promotions
            </Link>
          </div>
        </div>
      </section>

      {home.highlights?.length ? (
        <section className="container-page grid gap-6 py-12 md:grid-cols-4">
          {home.highlights.map((h) => (
            <div key={h.id} className="rounded-2xl bg-white p-6">
              <h2 className="font-sans text-base font-bold">{h.title}</h2>
              {h.text && <p className="mt-2 text-sm text-muted">{h.text}</p>}
            </div>
          ))}
        </section>
      ) : null}

      <section className="container-page py-12">
        <h2 className="text-3xl font-bold">Nos rayons</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {shownCategories.map((c) => (
            <Link key={c.id} href={categoryHref(c)} className="group overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative aspect-[4/3]">
                <ProductImage image={asMedia(c.image)} title={c.title} sizes="25vw" />
              </div>
              <p className="p-4 font-semibold group-hover:text-forest">{c.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.docs.length > 0 && (
        <section className="container-page py-12">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold">Notre sélection</h2>
            <Link href="/nos-produits" className="text-sm font-semibold text-forest underline">
              Tout le catalogue
            </Link>
          </div>
          <div className="mt-6">
            <ProductGrid products={featured.docs} />
          </div>
        </section>
      )}

      <section className="container-page py-12">
        <div className="grid gap-8 rounded-3xl bg-leaf-light p-8 md:grid-cols-2 md:p-12">
          <div>
            <h2 className="text-3xl font-bold">Venez nous voir</h2>
            <p className="mt-3 text-muted">
              Nos équipes vous conseillent sur le choix des végétaux et l&apos;entretien de votre jardin. Atelier de
              réparation et de révision pour votre matériel de motoculture.
            </p>
            {settings.address && <p className="mt-4 whitespace-pre-line font-semibold">{settings.address}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Nous contacter
              </Link>
              {settings.mapUrl && (
                <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  Itinéraire
                </a>
              )}
            </div>
          </div>
          {testimonials.docs.length > 0 && (
            <div className="space-y-4">
              {testimonials.docs.map((t) => (
                <blockquote key={t.id} className="rounded-2xl bg-white p-5 text-sm">
                  <p className="text-amber-500" aria-label={`${t.rating ?? 5} sur 5`}>
                    {'★'.repeat(t.rating ?? 5)}
                  </p>
                  <p className="mt-2 leading-relaxed">« {t.text} »</p>
                  <footer className="mt-2 font-semibold text-forest">{t.author}</footer>
                </blockquote>
              ))}
              <Link href="/avis-clients" className="text-sm font-semibold text-forest underline">
                Tous les avis
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
