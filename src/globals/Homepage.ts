import type { GlobalConfig } from 'payload'
import { anyone } from '../lib/access'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Page d’accueil',
  admin: { group: 'Contenu' },
  access: { read: anyone },
  fields: [
    {
      name: 'hero',
      label: 'Bandeau principal',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre', type: 'text' },
        { name: 'subtitle', label: 'Sous-titre', type: 'textarea' },
        { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'highlights',
      label: 'Points forts',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'text', label: 'Texte', type: 'textarea' },
      ],
    },
    {
      name: 'featuredCategories',
      label: 'Catégories mises en avant',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
  ],
}
