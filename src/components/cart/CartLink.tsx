'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'

export function CartLink() {
  const { count } = useCart()
  return (
    <Link
      href="/panier"
      className="relative inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-forest hover:border-leaf"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 7h14l-1.5 11.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 7Z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
      <span className="hidden sm:inline">Panier</span>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-earth px-1 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  )
}
