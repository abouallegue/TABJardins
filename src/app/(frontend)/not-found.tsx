import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold">Page introuvable</h1>
      <p className="mt-3 text-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
        <Link href="/nos-produits" className="btn-outline">
          Nos produits
        </Link>
      </div>
    </div>
  )
}
