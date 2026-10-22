// URL publique du site : variable explicite, sinon l'URL fournie par Vercel.
export const siteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  return vercel ? `https://${vercel}` : 'http://localhost:3000'
}
