import type { Field } from 'payload'

export const seoField: Field = {
  name: 'seo',
  label: 'Référencement (SEO)',
  type: 'group',
  fields: [
    { name: 'metaTitle', label: 'Titre pour Google', type: 'text' },
    { name: 'metaDescription', label: 'Description pour Google', type: 'textarea', maxLength: 300 },
  ],
}
