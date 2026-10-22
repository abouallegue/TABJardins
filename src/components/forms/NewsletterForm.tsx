'use client'

import { useActionState } from 'react'
import { subscribeNewsletter } from '@/lib/actions'

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, null)
  if (state?.ok) return <p className="mt-3 text-sm text-white">{state.message}</p>
  return (
    <form action={action} className="mt-3 flex gap-2">
      <input
        name="email"
        type="email"
        required
        placeholder="Votre e-mail"
        aria-label="Votre e-mail"
        className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50"
      />
      <button className="rounded-full bg-leaf px-4 text-sm font-semibold text-white" disabled={pending}>
        OK
      </button>
      {state && !state.ok && <p className="text-xs text-red-200">{state.message}</p>}
    </form>
  )
}
