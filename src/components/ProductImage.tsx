import Image from 'next/image'
import type { Media } from '@/payload-types'

// Visuel de remplacement tant que le produit n'a pas de photo.
function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-leaf-light text-leaf" aria-label={title}>
      <svg viewBox="0 0 64 64" className="h-1/3 w-1/3" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M32 58V30" />
        <path d="M32 34c-10 0-18-8-18-20 12 0 18 8 18 20Z" />
        <path d="M32 42c8 0 16-6 16-18-10 0-16 6-16 18Z" />
      </svg>
    </div>
  )
}

type Props = { image?: Media | null; title: string; sizes: string; priority?: boolean }

export function ProductImage({ image, title, sizes, priority }: Props) {
  if (!image?.url) return <Placeholder title={title} />
  return (
    <Image
      src={image.url}
      alt={image.alt || title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  )
}
