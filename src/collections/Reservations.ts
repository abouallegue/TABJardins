import type { CollectionConfig } from 'payload'
import { isLoggedIn, nobody } from '../lib/access'

// Demandes de réservation envoyées depuis le panier : pas de paiement en ligne,
// le client paie et retire sa commande en magasin.
export const Reservations: CollectionConfig = {
  slug: 'reservations',
  labels: { singular: 'Réservation', plural: 'Réservations' },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'customerName', 'total', 'status', 'createdAt'],
    group: 'Ventes',
    description: 'Commandes à préparer pour un retrait en magasin.',
  },
  access: { read: isLoggedIn, create: nobody, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'reference', label: 'Référence', type: 'text', admin: { readOnly: true } },
        {
          name: 'status',
          label: 'Statut',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: 'Nouvelle', value: 'new' },
            { label: 'En préparation', value: 'preparing' },
            { label: 'Prête à retirer', value: 'ready' },
            { label: 'Retirée', value: 'collected' },
            { label: 'Annulée', value: 'cancelled' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'customerName', label: 'Nom', type: 'text', required: true },
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'phone', label: 'Téléphone', type: 'text', required: true },
      ],
    },
    {
      name: 'items',
      label: 'Articles',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'product', label: 'Produit', type: 'relationship', relationTo: 'products' },
            { name: 'title', label: 'Libellé', type: 'text', required: true },
            { name: 'variant', label: 'Option', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'quantity', label: 'Quantité', type: 'number', min: 1, required: true },
            { name: 'unitPrice', label: 'Prix unitaire (€)', type: 'number' },
          ],
        },
      ],
    },
    { name: 'total', label: 'Total estimé (€)', type: 'number' },
    { name: 'message', label: 'Message du client', type: 'textarea' },
    { name: 'internalNotes', label: 'Notes internes', type: 'textarea' },
  ],
}
