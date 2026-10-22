import type { CollectionConfig } from 'payload'
import { isLoggedIn, nobody } from '../lib/access'

export const contactSubjects = [
  { label: 'Conseil / question sur un végétal', value: 'conseil' },
  { label: 'Produit non référencé sur le site', value: 'produit' },
  { label: 'Réparation ou révision de matériel', value: 'atelier' },
  { label: 'Autre demande', value: 'autre' },
]

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Message', plural: 'Messages de contact' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject', 'status', 'createdAt'],
    group: 'Ventes',
  },
  access: { read: isLoggedIn, create: nobody, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'phone', label: 'Téléphone', type: 'text' },
      ],
    },
    { name: 'subject', label: 'Objet', type: 'select', options: contactSubjects, defaultValue: 'autre' },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Traité', value: 'done' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
