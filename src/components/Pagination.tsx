import Link from 'next/link'
import type { SearchParams } from '@/lib/catalog'

type Props = { basePath: string; params: SearchParams; page: number; totalPages: number }

export function Pagination({ basePath, params, page, totalPages }: Props) {
  if (totalPages <= 1) return null
  const href = (p: number) => {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (k === 'page' || v === undefined) continue
      for (const value of Array.isArray(v) ? v : [v]) qs.append(k, value)
    }
    if (p > 1) qs.set('page', String(p))
    const s = qs.toString()
    return s ? `${basePath}?${s}` : basePath
  }
  return (
    <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${
            p === page ? 'bg-forest text-white' : 'bg-white text-forest hover:bg-leaf-light'
          }`}
        >
          {p}
        </Link>
      ))}
    </nav>
  )
}
