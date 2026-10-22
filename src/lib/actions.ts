'use server'

import { getPayloadClient } from './payload'
import { priceFor } from './price'

export type FormState = { ok: boolean; message: string } | null

const text = (data: FormData, key: string) => String(data.get(key) ?? '').trim()
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export async function subscribeNewsletter(_: FormState, data: FormData): Promise<FormState> {
  const email = text(data, 'email').toLowerCase()
  if (!isEmail(email)) return { ok: false, message: 'Adresse e-mail invalide.' }
  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'newsletter-subscribers',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (!existing.docs.length) {
    await payload.create({ collection: 'newsletter-subscribers', data: { email } })
  }
  return { ok: true, message: 'Merci, vous êtes bien inscrit(e) !' }
}

export async function sendContactMessage(_: FormState, data: FormData): Promise<FormState> {
  // Champ piège invisible : rempli uniquement par les robots.
  if (text(data, 'website')) return { ok: true, message: 'Message envoyé.' }
  const name = text(data, 'name')
  const email = text(data, 'email')
  const message = text(data, 'message')
  if (!name || !isEmail(email) || !message) {
    return { ok: false, message: 'Merci de renseigner votre nom, un e-mail valide et votre message.' }
  }
  const payload = await getPayloadClient()
  await payload.create({
    collection: 'contact-messages',
    data: {
      name,
      email,
      phone: text(data, 'phone'),
      subject: (text(data, 'subject') || 'autre') as 'conseil' | 'produit' | 'atelier' | 'autre',
      message,
    },
  })
  return { ok: true, message: 'Merci ! Votre message a bien été envoyé, nous vous répondons rapidement.' }
}

type CartLine = { productId: number; variant?: string; quantity: number }

export async function submitReservation(_: FormState, data: FormData): Promise<FormState> {
  if (text(data, 'website')) return { ok: true, message: 'Réservation envoyée.' }
  const customerName = text(data, 'name')
  const email = text(data, 'email')
  const phone = text(data, 'phone')
  if (!customerName || !isEmail(email) || !phone) {
    return { ok: false, message: 'Merci de renseigner votre nom, un e-mail valide et votre téléphone.' }
  }

  let lines: CartLine[]
  try {
    lines = JSON.parse(text(data, 'cart'))
  } catch {
    return { ok: false, message: 'Panier illisible, merci de réessayer.' }
  }
  if (!Array.isArray(lines) || !lines.length) return { ok: false, message: 'Votre panier est vide.' }

  // Les prix sont recalculés côté serveur à partir du catalogue.
  const payload = await getPayloadClient()
  const items = []
  for (const line of lines.slice(0, 50)) {
    const product = await payload
      .findByID({ collection: 'products', id: line.productId, depth: 0, overrideAccess: false })
      .catch(() => null)
    if (!product) continue
    const variant = line.variant ? product.variants?.find((v) => v.label === line.variant) : undefined
    items.push({
      product: product.id,
      title: product.title,
      variant: variant?.label,
      quantity: Math.min(Math.max(1, Math.floor(Number(line.quantity) || 1)), 99),
      unitPrice: priceFor(product, variant)?.price,
    })
  }
  if (!items.length) return { ok: false, message: 'Les produits de votre panier ne sont plus disponibles.' }

  const total = items.reduce((sum, i) => sum + (i.unitPrice ?? 0) * i.quantity, 0)
  const reference = `R${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  await payload.create({
    collection: 'reservations',
    data: { reference, customerName, email, phone, items, total, message: text(data, 'message') },
  })

  return {
    ok: true,
    message: `Merci ! Votre réservation ${reference} est enregistrée. Nous vous contactons dès qu'elle est prête à être retirée en magasin.`,
  }
}
