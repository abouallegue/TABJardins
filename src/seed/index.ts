// Données de départ : `pnpm seed`. Le script est idempotent (il ne recrée pas ce qui existe déjà).
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'

import { categoryTree, sampleProducts, type SeedCategory } from './data'
import { richText } from './richtext'

async function upsertCategory(payload: Payload, cat: SeedCategory, parent: number | null, order: number) {
  const existing = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } }, limit: 1 })
  const data = { title: cat.title, slug: cat.slug, tagline: cat.tagline, parent, order }
  const doc = existing.docs[0]
    ? await payload.update({ collection: 'categories', id: existing.docs[0].id, data })
    : await payload.create({ collection: 'categories', data })
  for (const [i, child] of (cat.children ?? []).entries()) await upsertCategory(payload, child, doc.id, i)
}

async function upsertBySlug(payload: Payload, collection: 'pages' | 'posts', data: { slug: string; title: string } & Record<string, unknown>) {
  const existing = await payload.find({ collection, where: { slug: { equals: data.slug } }, limit: 1 })
  if (!existing.docs.length) await payload.create({ collection, data: data as never })
}

async function seed() {
  const payload = await getPayload({ config })

  for (const [i, root] of categoryTree.entries()) await upsertCategory(payload, root, null, i)
  payload.logger.info('Catégories prêtes')

  const fruitiers = await payload.find({ collection: 'categories', where: { slug: { equals: 'arbres-fruitiers' } }, limit: 1 })
  if (fruitiers.docs[0] && !fruitiers.docs[0].faq?.length) {
    await payload.update({
      collection: 'categories',
      id: fruitiers.docs[0].id,
      data: {
        intro: richText(
          'Les arbres fruitiers sont les compagnons gourmands du jardin : fleurs au printemps, fruits à la belle saison et belles couleurs à l’automne.',
          'Palissés le long d’un mur, isolés sur la pelouse ou réunis en verger, ils trouvent leur place dans tous les jardins.',
        ),
        faq: [
          { question: 'Quand planter un arbre fruitier ?', answer: 'De novembre à mars, hors période de gel, pour les arbres en racines nues. Toute l’année pour les arbres en conteneur, en évitant les fortes chaleurs.' },
          { question: 'Faut-il plusieurs arbres pour avoir des fruits ?', answer: 'Certaines variétés ont besoin d’un pollinisateur à proximité. Demandez-nous conseil en magasin pour choisir les bonnes associations.' },
        ],
      },
    })
  }

  const categories = await payload.find({ collection: 'categories', limit: 200, depth: 0 })
  const catId = (slug: string) => categories.docs.find((c) => c.slug === slug)?.id

  for (const p of sampleProducts) {
    const existing = await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, limit: 1 })
    if (existing.docs.length) continue
    const parentSlug = categoryTree.find((root) => root.children?.some((c) => c.slug === p.category))?.slug
    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        slug: p.slug,
        brand: 'brand' in p ? p.brand : undefined,
        shortDescription: 'shortDescription' in p ? p.shortDescription : undefined,
        price: 'price' in p ? p.price : undefined,
        variantLabel: 'variantLabel' in p ? p.variantLabel : undefined,
        variants: 'variants' in p ? p.variants : undefined,
        stock: 'stock' in p ? p.stock : 'in_stock',
        specs: 'specs' in p ? p.specs?.map(([label, value]) => ({ label, value })) : undefined,
        plant: 'plant' in p ? (p.plant as never) : undefined,
        featured: Boolean('featured' in p && p.featured),
        categories: [catId(p.category), parentSlug ? catId(parentSlug) : undefined].filter((id): id is number => !!id),
      },
    })
  }
  payload.logger.info('Produits de démonstration prêts')

  const pages = [
    {
      title: 'Notre entreprise',
      slug: 'notre-entreprise',
      content: richText(
        { h2: 'Votre partenaire vert depuis 1987' },
        'TAB Jardins est une entreprise familiale installée à Étampes. La pépinière a été créée par Thierry Bedeau en 1987 et s’est enrichie en 2012 d’une activité de motoculture.',
        'Nous vous accompagnons avec des conseils personnalisés sur le choix des plantes et l’entretien du jardin. Un végétal ne figure pas dans notre catalogue ? Nous pouvons le commander auprès de nos fournisseurs partenaires.',
        'Côté motoculture, nous assurons la vente, la réparation et la révision de votre matériel.',
      ),
    },
    { title: 'Pépinière à Étampes', slug: 'pepiniere-etampes', content: richText('Contenu à reprendre depuis l’ancien site lors de la migration.') },
    { title: 'Mentions légales', slug: 'mention-legales', content: richText('Contenu à reprendre depuis l’ancien site lors de la migration.') },
    { title: 'Conditions générales de vente', slug: 'cgv', content: richText('Contenu à reprendre depuis l’ancien site lors de la migration.') },
  ]
  for (const page of pages) await upsertBySlug(payload, 'pages', page)
  payload.logger.info('Pages prêtes')

  const settings = await payload.findGlobal({ slug: 'settings' })
  if (!settings.address) {
    await payload.updateGlobal({
      slug: 'settings',
      data: {
        address: '30 route de Chalo-Saint-Mars\n91150 Étampes',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=TAB+Jardins+30+route+de+Chalo+Saint+Mars+91150+Etampes',
      },
    })
  }

  const home = await payload.findGlobal({ slug: 'homepage' })
  if (!home.highlights?.length) {
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        hero: {
          title: 'Votre partenaire vert à Étampes',
          subtitle:
            'Pépinière familiale depuis 1987 : végétaux sélectionnés avec soin et matériel de motoculture, avec les conseils de passionnés.',
        },
        highlights: [
          { title: 'Conseils de pépiniéristes', text: 'Plantation, entretien, choix des variétés : on vous accompagne.' },
          { title: 'Réservez en ligne', text: 'Réservez vos produits sur le site et retirez-les en magasin.' },
          { title: 'Atelier motoculture', text: 'Vente, réparation et révision de votre matériel.' },
          { title: 'Commande spéciale', text: 'Un végétal introuvable ? Nous le commandons pour vous.' },
        ],
      },
    })
  }
  payload.logger.info('Réglages prêts')
  process.exit(0)
}

await seed()
