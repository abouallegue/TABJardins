'use client'

import Link from 'next/link'
import { useState } from 'react'

import { useCart } from './CartProvider'

export type PurchaseOption = {
  label?: string
  price: number | null
  regular: number | null
  stock: string
}

type Props = {
  productId: number
  slug: string
  title: string
  image?: string
  variantLabel?: string | null
  options: PurchaseOption[]
  hasVariants: boolean
}

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
const stockText: Record<string, string> = {
  in_stock: 'En stock',
  on_order: 'Sur commande',
  out_of_stock: 'Rupture de stock',
}

export function AddToCart({ productId, slug, title, image, variantLabel, options, hasVariants }: Props) {
  const { add } = useCart()
  const [selected, setSelected] = useState<number | null>(hasVariants ? null : 0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const option = selected === null ? null : options[selected]
  const unavailable = option?.stock === 'out_of_stock'
  const prices = options.map((o) => o.price).filter((p): p is number => p !== null)
  const fromPrice = prices.length ? Math.min(...prices) : null

  return (
    <div className="space-y-5">
      <div className="min-h-9">
        {option ? (
          option.price !== null ? (
            <p className="flex items-baseline gap-3">
              <span className={`text-3xl font-bold ${option.regular ? 'text-sale' : 'text-forest'}`}>
                {euro.format(option.price)}
              </span>
              {option.regular && <s className="text-lg text-muted">{euro.format(option.regular)}</s>}
            </p>
          ) : (
            <p className="text-lg font-semibold text-forest">Prix en magasin</p>
          )
        ) : (
          <p className="text-sm text-muted">
            {fromPrice !== null ? (
              <>
                À partir de <span className="text-2xl font-bold text-forest">{euro.format(fromPrice)}</span>
              </>
            ) : (
              'Choisissez une option.'
            )}
          </p>
        )}
      </div>

      {hasVariants && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{variantLabel || 'Option'}</legend>
          <div className="flex flex-wrap gap-2">
            {options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                onClick={() => {
                  setSelected(i)
                  setAdded(false)
                }}
                aria-pressed={selected === i}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selected === i ? 'border-forest bg-forest text-white' : 'border-line bg-white hover:border-leaf'
                } ${o.stock === 'out_of_stock' ? 'line-through opacity-60' : ''}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {option && (
        <p className={`text-sm font-semibold ${unavailable ? 'text-sale' : 'text-leaf'}`}>{stockText[option.stock]}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          Quantité
          <input
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="field w-20"
          />
        </label>
        <button
          type="button"
          className="btn-primary"
          disabled={!option || unavailable}
          onClick={() => {
            if (!option) return
            add({ productId, slug, title, image, variant: option.label, unitPrice: option.price, quantity })
            setAdded(true)
          }}
        >
          Ajouter au panier
        </button>
      </div>

      {added && (
        <p className="rounded-lg bg-leaf-light px-4 py-3 text-sm text-forest">
          Ajouté au panier.{' '}
          <Link href="/panier" className="font-semibold underline">
            Voir le panier et réserver
          </Link>
        </p>
      )}
      <p className="text-xs text-muted">
        Réservation en ligne, paiement et retrait en magasin à Étampes.
      </p>
    </div>
  )
}
