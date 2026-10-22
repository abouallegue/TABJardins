import type { Field, FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const source = data?.[fallback]
    return typeof source === 'string' ? slugify(source) : value
  }

export const slugField = (fallback = 'title'): Field => ({
  name: 'slug',
  label: 'Adresse (slug)',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Laisser vide pour la générer à partir du titre.',
  },
  hooks: { beforeValidate: [formatSlug(fallback)] },
})
