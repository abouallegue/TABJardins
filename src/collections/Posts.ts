import type { CollectionConfig } from 'payload'
import { slugField } from '../lib/slug'
import { seoField } from '../lib/seoField'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Conseil', plural: 'Conseils jardin' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'published'],
    group: 'Contenu',
    description: 'Articles de la rubrique « Tout sur son jardin ».',
  },
  access: {
    read: ({ req }) => (req.user ? true : { published: { equals: true } }),
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'excerpt', label: 'Résumé', type: 'textarea' },
    { name: 'cover', label: 'Image', type: 'upload', relationTo: 'media' },
    { name: 'content', label: 'Contenu', type: 'richText' },
    seoField,
    slugField(),
    {
      name: 'publishedAt',
      label: 'Date de publication',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      label: 'Publié',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
