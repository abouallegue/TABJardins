import type { CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload'
import { anyone } from '../lib/access'
import { slugField } from '../lib/slug'
import { seoField } from '../lib/seoField'
import { plantAttributes, type PlantAttributeKey } from '../lib/plantAttributes'

const stockOptions = [
  { label: 'En stock', value: 'in_stock' },
  { label: 'Sur commande', value: 'on_order' },
  { label: 'Rupture de stock', value: 'out_of_stock' },
]

const plantField = (name: PlantAttributeKey): Field => ({
  name,
  label: plantAttributes[name].label,
  type: 'select',
  hasMany: true,
  options: [...plantAttributes[name].options],
})

// Prix le plus bas (options comprises), utilisé pour trier le catalogue par prix.
const computeMinPrice: CollectionBeforeChangeHook = ({ data }) => {
  const prices = [data.price, ...(data.variants ?? []).map((v: { price?: number | null }) => v.price)].filter(
    (p): p is number => typeof p === 'number',
  )
  return { ...data, minPrice: prices.length ? Math.min(...prices) : null }
}

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produit', plural: 'Produits' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'price', 'stock', 'visible'],
    group: 'Catalogue',
    listSearchableFields: ['title', 'sku', 'brand'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { visible: { equals: true } }),
  },
  hooks: { beforeChange: [computeMinPrice] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Général',
          fields: [
            { name: 'title', label: 'Nom', type: 'text', required: true },
            { name: 'shortDescription', label: 'Description courte', type: 'textarea' },
            { name: 'description', label: 'Description', type: 'richText' },
            {
              name: 'images',
              label: 'Photos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Prix et stock',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: 'Prix TTC (€)',
                  type: 'number',
                  min: 0,
                  admin: { description: 'Laisser vide pour afficher « Prix en magasin ».' },
                },
                {
                  name: 'salePrice',
                  label: 'Prix promo TTC (€)',
                  type: 'number',
                  min: 0,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'saleStart', label: 'Début de la promo', type: 'date' },
                { name: 'saleEnd', label: 'Fin de la promo', type: 'date' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'sku', label: 'Référence (SKU)', type: 'text' },
                {
                  name: 'stock',
                  label: 'Disponibilité',
                  type: 'select',
                  defaultValue: 'in_stock',
                  options: stockOptions,
                },
              ],
            },
            {
              name: 'variantLabel',
              label: 'Nom de l’option',
              type: 'text',
              admin: { description: 'Ex. « Taille du pot » ou « Batterie + chargeur ».' },
            },
            {
              name: 'variants',
              label: 'Options / variations',
              type: 'array',
              labels: { singular: 'Option', plural: 'Options' },
              admin: { description: 'Chaque option peut avoir son propre prix et sa disponibilité.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Libellé', type: 'text', required: true },
                    { name: 'price', label: 'Prix (€)', type: 'number', min: 0 },
                    { name: 'salePrice', label: 'Prix promo (€)', type: 'number', min: 0 },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'sku', label: 'Référence', type: 'text' },
                    {
                      name: 'stock',
                      label: 'Disponibilité',
                      type: 'select',
                      defaultValue: 'in_stock',
                      options: stockOptions,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Caractéristiques',
          fields: [
            { name: 'brand', label: 'Marque', type: 'text' },
            {
              name: 'specs',
              label: 'Caractéristiques techniques',
              type: 'array',
              labels: { singular: 'Caractéristique', plural: 'Caractéristiques' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Nom', type: 'text', required: true },
                    { name: 'value', label: 'Valeur', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              name: 'plant',
              label: 'Attributs végétaux',
              type: 'group',
              admin: { description: 'Servent aux filtres des catégories de végétaux.' },
              fields: [
                plantField('exposure'),
                plantField('foliage'),
                plantField('foliageColor'),
                plantField('flowerColor'),
                plantField('floweringMonths'),
                {
                  type: 'row',
                  fields: [
                    { ...plantField('height'), hasMany: false } as Field,
                    { ...plantField('hardiness'), hasMany: false } as Field,
                  ],
                },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    slugField(),
    {
      name: 'visible',
      label: 'Visible sur le site',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: 'Mis en avant sur l’accueil',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'categories',
      label: 'Catégories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'minPrice',
      type: 'number',
      index: true,
      admin: { hidden: true },
    },
    {
      name: 'related',
      label: 'Produits associés',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
