import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { anyone } from '../lib/access'
import { slugField } from '../lib/slug'
import { seoField } from '../lib/seoField'

// Chemin complet de la catégorie (ex. « vegetaux/arbustes/caducs-arbustes »),
// utilisé pour conserver les URL /categorie-produit/... du site WordPress.
const computePath: CollectionBeforeChangeHook = async ({ data, req }) => {
  let path = data.slug as string
  if (data.parent) {
    const parentId = typeof data.parent === 'object' ? data.parent.id : data.parent
    const parent = await req.payload.findByID({ collection: 'categories', id: parentId, depth: 0, req })
    if (parent?.path) path = `${parent.path}/${path}`
  }
  return { ...data, path }
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Catégorie', plural: 'Catégories' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'order'],
    group: 'Catalogue',
  },
  access: { read: anyone },
  defaultSort: 'order',
  hooks: { beforeChange: [computePath] },
  fields: [
    { name: 'title', label: 'Nom', type: 'text', required: true },
    slugField(),
    {
      name: 'path',
      label: 'Chemin complet',
      type: 'text',
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'parent',
      label: 'Catégorie parente',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      label: "Ordre d'affichage",
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
    { name: 'tagline', label: 'Sous-titre', type: 'text' },
    { name: 'intro', label: "Texte d'introduction", type: 'richText' },
    {
      name: 'faq',
      label: 'Questions fréquentes',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      fields: [
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'answer', label: 'Réponse', type: 'textarea', required: true },
      ],
    },
    seoField,
  ],
}
