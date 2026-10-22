'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  productId: number
  slug: string
  title: string
  variant?: string
  unitPrice: number | null
  quantity: number
  image?: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  ready: boolean
  add: (item: CartItem) => void
  setQuantity: (productId: number, variant: string | undefined, quantity: number) => void
  remove: (productId: number, variant: string | undefined) => void
  clear: () => void
}

const STORAGE_KEY = 'tabjardins-panier'
const CartContext = createContext<CartContextValue | null>(null)

const sameLine = (a: Pick<CartItem, 'productId' | 'variant'>, productId: number, variant?: string) =>
  a.productId === productId && (a.variant ?? '') === (variant ?? '')

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {
      // Stockage indisponible (navigation privée) : panier non persistant.
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignoré
    }
  }, [items, ready])

  const add = useCallback((item: CartItem) => {
    setItems((current) => {
      const existing = current.find((i) => sameLine(i, item.productId, item.variant))
      if (!existing) return [...current, item]
      return current.map((i) =>
        sameLine(i, item.productId, item.variant) ? { ...i, quantity: i.quantity + item.quantity } : i,
      )
    })
  }, [])

  const setQuantity = useCallback((productId: number, variant: string | undefined, quantity: number) => {
    setItems((current) =>
      current.map((i) => (sameLine(i, productId, variant) ? { ...i, quantity: Math.max(1, quantity) } : i)),
    )
  }, [])

  const remove = useCallback((productId: number, variant: string | undefined) => {
    setItems((current) => current.filter((i) => !sameLine(i, productId, variant)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      total: items.reduce((sum, i) => sum + (i.unitPrice ?? 0) * i.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [items, ready, add, setQuantity, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans CartProvider')
  return ctx
}
