'use client'

import { useActionState } from 'react'
import { sendContactMessage } from '@/lib/actions'

type Props = { subjects: { label: string; value: string }[]; defaultSubject?: string }

export function ContactForm({ subjects, defaultSubject }: Props) {
  const [state, action, pending] = useActionState(sendContactMessage, null)
  if (state?.ok) return <p className="rounded-xl bg-leaf-light p-6 text-forest">{state.message}</p>
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Nom *
          <input name="name" required className="field" autoComplete="name" />
        </label>
        <label className="grid gap-1 text-sm">
          Téléphone
          <input name="phone" type="tel" className="field" autoComplete="tel" />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        E-mail *
        <input name="email" type="email" required className="field" autoComplete="email" />
      </label>
      <label className="grid gap-1 text-sm">
        Objet
        <select name="subject" className="field" defaultValue={defaultSubject ?? 'autre'}>
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        Message *
        <textarea name="message" required rows={6} className="field" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state && !state.ok && <p className="text-sm text-sale">{state.message}</p>}
      <button className="btn-primary justify-self-start" disabled={pending}>
        {pending ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  )
}
