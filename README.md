# TAB Jardins

Nouveau site de TAB Jardins (pépinière et motoculture à Étampes), en remplacement du WordPress actuel.

- **Site** : Next.js (App Router) + Tailwind CSS
- **Back-office** : Payload CMS, intégré au même projet, sur `/admin`
- **Base de données** : PostgreSQL (Neon en production)
- **Hébergement prévu** : Vercel

## Démarrer en local

Prérequis : Node.js 22.23+ ou 24.22+, pnpm, PostgreSQL.

```bash
cp .env.example .env      # puis renseigner DATABASE_URI et PAYLOAD_SECRET
pnpm install
pnpm seed                 # catégories, pages et quelques produits de démonstration
pnpm dev
```

- Site : http://localhost:3000
- Back-office : http://localhost:3000/admin (le premier compte se crée à la première visite)

## Ce que gère le back-office

| Rubrique | Contenu |
| --- | --- |
| Catalogue › Produits | prix, prix promo avec dates, options (variations) avec prix et stock, photos, fiche technique, attributs végétaux (exposition, rusticité…), produits associés, SEO |
| Catalogue › Catégories | arborescence, texte d'introduction, FAQ, SEO |
| Ventes › Réservations | demandes envoyées depuis le panier (retrait et paiement en magasin), avec statut |
| Ventes › Messages de contact | formulaire de contact (conseil, produit non référencé, atelier) |
| Ventes › Inscrits newsletter | e-mails collectés en pied de page |
| Contenu | pages libres, conseils jardin, avis clients, page d'accueil, médias |
| Administration | informations du magasin (téléphone, horaires, adresse, réseaux, bandeau d'annonce), utilisateurs |

## Choix fonctionnels

- **Pas de paiement en ligne** : le panier envoie une demande de réservation ; le client paie et retire en magasin. Les prix sont recalculés côté serveur.
- **URL conservées** : `/produit/…`, `/categorie-produit/…` et les pages à la racine gardent les mêmes adresses que sur WordPress. Les anciennes pages en doublon (`/arbres/`, `/nos-vegetaux/`, `/robots-tondeuses/`…) redirigent en 301 vers la catégorie correspondante (voir `redirects.mjs`).
- **Filtres végétaux** sans JavaScript (formulaire GET), donc partageables et indexables.
- **SEO** : sitemap, robots.txt, balises canoniques, données structurées (Product, FAQ, fil d'Ariane).

## Modifier le modèle de données

1. Modifier une collection dans `src/collections/` ou un global dans `src/globals/`.
2. `pnpm generate:types` puis `pnpm generate:importmap` si des composants d'admin changent.
3. `pnpm payload migrate:create <nom>` pour créer la migration de base de données. En production, la commande de build est `pnpm ci`, qui applique les migrations puis construit le site.

## Déploiement sur Vercel

1. Sur vercel.com : **Add New › Project**, importer le dépôt `TABJardins` (le fichier `vercel.json` règle la commande de build).
2. Onglet **Storage** du projet : créer une base **Neon** (Postgres) et la connecter au projet. La variable `DATABASE_URL` est ajoutée automatiquement.
3. **Settings › Environment Variables** :
   - `PAYLOAD_SECRET` : une longue chaîne aléatoire
   - `SEED_DEMO` = `true` pour charger les données de démonstration (à retirer ensuite)
   - `NEXT_PUBLIC_SERVER_URL` : l'adresse définitive du site, une fois le domaine branché
4. Relancer le déploiement. Le build applique les migrations de base de données puis construit le site.

À prévoir avant la mise en ligne : stockage des médias (Vercel Blob ou S3), le disque de Vercel n'étant pas persistant.
