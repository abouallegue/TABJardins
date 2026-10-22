'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useEffect } from 'react'

import { submitReservation } from '@/lib/actions'
import { useCart } from './CartProvider'

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export function CartView() {
  const { items, total, ready, setQuantity, remove, clear } = useCart()
  const [state, action, pending] = useActionState(submitReservation, null)

  useEffect(() => {
    if (state?.ok) clear()
  }, [state, clear])

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-leaf-light p-8 text-forest">
        <p className="text-lg font-semibold">{state.message}</p>
        <Link href="/nos-produits" className="btn-outline mt-6">
          Continuer mes achats
        </Link>
      </div>
    )
  }

  if (!ready) return <p className="text-muted">Chargement du panier…</p>

  if (!items.length) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-muted">Votre panier est vide.</p>
        <Link href="/nos-produits" className="btn-primary mt-6">
          Découvrir nos produits
        </Link>
      </div>
    )
  }

  const hasUnpriced = items.some((i) => i.unitPrice === null)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
        {items.map((item) => (
          <li key={`${item.productId}-${item.variant ?? ''}`} className="flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-leaf-light">
              {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Link href={`/produit/${item.slug}`} className="font-semibold hover:text-forest">
                {item.title}
              </Link>
              {item.variant && <span className="text-sm text-muted">{item.variant}</span>}
              <div className="mt-auto flex flex-wrap items-center gap-3 text-sm">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={item.quantity}
                  aria-label="Quantité"
                  onChange={(e) => setQuantity(item.productId, item.variant, Number(e.target.value) || 1)}
                  className="field w-20"
                />
                <button type="button" onClick={() => remove(item.productId, item.variant)} className="text-muted underline">
                  Retirer
                </button>
              </div>
            </div>
            <div className="text-right font-semibold text-forest">
              {item.unitPrice !== null ? euro.format(item.unitPrice * item.quantity) : 'Prix en magasin'}
            </div>
          </li>
        ))}
      </ul>

      <form action={action} className="h-fit space-y-4 rounded-2xl border border-line bg-white p-6">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">Total estimé</span>
          <span className="text-2xl font-bold text-forest">{euro.format(total)}</span>
        </div>
        {hasUnpriced && <p className="text-xs text-muted">Certains articles sont au prix magasin.</p>}
        <p className="rounded-lg bg-cream p-3 text-sm">
          Aucun paiement en ligne : nous préparons votre commande, vous la réglez et la retirez en magasin.
        </p>
        <input type="hidden" name="cart" value={JSON.stringify(items.map(({ productId, variant, quantity }) => ({ productId, variant, quantity })))} />
        <label className="grid gap-1 text-sm">
          Nom *
          <input name="name" required className="field" autoComplete="name" />
        </label>
        <label className="grid gap-1 text-sm">
          E-mail *
          <input name="email" type="email" required className="field" autoComplete="email" />
        </label>
        <label className="grid gap-1 text-sm">
          Téléphone *
          <input name="phone" type="tel" required className="field" autoComplete="tel" />
        </label>
        <label className="grid gap-1 text-sm">
          Message
          <textarea name="message" rows={3} className="field" />
        </label>
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        {state && !state.ok && <p className="text-sm text-sale">{state.message}</p>}
        <button className="btn-primary w-full" disabled={pending}>
          {pending ? 'Envoi…' : 'Réserver pour un retrait en magasin'}
        </button>
      </form>
    </div>
  )
}
