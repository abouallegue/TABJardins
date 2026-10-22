import type { CollectionConfig } from 'payload'
import { anyone } from '../lib/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Avis client', plural: 'Avis clients' },
  admin: { useAsTitle: 'author', defaultColumns: ['author', 'source', 'rating', 'date'], group: 'Contenu' },
  access: { read: anyone },
  defaultSort: '-date',
  fields: [
    { name: 'author', label: 'Nom', type: 'text', required: true },
    { name: 'text', label: 'Avis', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          label: 'Source',
          type: 'select',
          defaultValue: 'google',
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'En magasin', value: 'magasin' },
          ],
        },
        { name: 'rating', label: 'Note (sur 5)', type: 'number', min: 1, max: 5, defaultValue: 5 },
        { name: 'date', label: 'Date', type: 'date' },
      ],
    },
  ],
}
