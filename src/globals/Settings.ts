import type { GlobalConfig } from 'payload'
import { anyone } from '../lib/access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Informations du magasin',
  admin: { group: 'Administration' },
  access: { read: anyone },
  fields: [
    { name: 'phone', label: 'Téléphone', type: 'text' },
    { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'address', label: 'Adresse', type: 'textarea' },
    { name: 'mapUrl', label: 'Lien Google Maps', type: 'text' },
    {
      name: 'openingHours',
      label: 'Horaires',
      type: 'array',
      labels: { singular: 'Ligne', plural: 'Lignes' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'days', label: 'Jours', type: 'text', required: true },
            { name: 'hours', label: 'Horaires', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'announcement',
      label: 'Bandeau d’annonce',
      type: 'text',
      admin: { description: 'Affiché en haut de toutes les pages (laisser vide pour masquer).' },
    },
    {
      type: 'row',
      fields: [
        { name: 'facebook', label: 'Page Facebook', type: 'text' },
        { name: 'instagram', label: 'Compte Instagram', type: 'text' },
        { name: 'googleReviews', label: 'Lien avis Google', type: 'text' },
      ],
    },
  ],
}
