import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  auth: true,
  admin: { useAsTitle: 'email', group: 'Administration' },
  fields: [{ name: 'name', label: 'Nom', type: 'text' }],
}
