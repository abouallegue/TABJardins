# Consignes pour Claude

- Le propriétaire du site est francophone : textes du site, du back-office et commentaires en français.
- Stack : Next.js 16 (App Router, `src/app/(frontend)`), Payload CMS 3 (`src/payload.config.ts`, admin dans `src/app/(payload)`), PostgreSQL, Tailwind CSS 4 (`src/app/(frontend)/globals.css`, utilitaires maison via `@utility`).
- Node 22.23+ ou 24.22+ requis par Payload.
- Après toute modification d'une collection ou d'un global : `pnpm generate:types`, puis `pnpm payload migrate:create <nom>` et commiter la migration.
- Vérifier avant de livrer : `pnpm typecheck` et `pnpm build` (le build interroge la base de données).
- Pas de paiement en ligne : le panier crée une « réservation » (`src/lib/actions.ts`), retrait et paiement en magasin.
- Garder les URL héritées de WordPress (`/produit/…`, `/categorie-produit/…`) ; toute URL supprimée doit avoir une redirection 301 dans `redirects.mjs`.
