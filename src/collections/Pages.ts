import type { CollectionConfig } from 'payload'
import { anyone } from '../lib/access'
import { slugField } from '../lib/slug'
import { seoField } from '../lib/seoField'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Contenu',
    description: 'Pages libres : notre entreprise, mentions légales, CGV, pépinière Étampes…',
  },
  access: { read: anyone },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    slugField(),
    { name: 'heroImage', label: 'Image d’en-tête', type: 'upload', relationTo: 'media' },
    { name: 'content', label: 'Contenu', type: 'richText' },
    seoField,
  ],
}
