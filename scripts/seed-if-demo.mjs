// Charge les données de démonstration pendant le build si SEED_DEMO=true
// (utile pour un premier aperçu sur Vercel ; à retirer une fois le vrai catalogue importé).
import { execSync } from 'node:child_process'

if (process.env.SEED_DEMO === 'true') {
  execSync('pnpm seed', { stdio: 'inherit' })
}
