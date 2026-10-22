import type { Metadata } from 'next'
import React from 'react'

import { CartProvider } from '@/components/cart/CartProvider'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { siteUrl } from '@/lib/siteUrl'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'TAB Jardins – Pépinière et motoculture à Étampes',
    template: '%s · TAB Jardins',
  },
  description:
    'Pépinière familiale à Étampes depuis 1987 : arbres, arbustes, fruitiers, rosiers, vivaces et matériel de motoculture (vente, réparation, révision).',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
