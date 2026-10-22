import type { CollectionConfig } from 'payload'
import { isLoggedIn, nobody } from '../lib/access'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Inscrit newsletter', plural: 'Inscrits newsletter' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'createdAt'], group: 'Ventes' },
  access: { read: isLoggedIn, create: nobody, update: isLoggedIn, delete: isLoggedIn },
  fields: [{ name: 'email', label: 'E-mail', type: 'email', required: true, unique: true }],
}
