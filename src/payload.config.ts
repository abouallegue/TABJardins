import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { fr } from '@payloadcms/translations/languages/fr'
import sharp from 'sharp'

import { siteUrl } from './lib/siteUrl'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Testimonials } from './collections/Testimonials'
import { Reservations } from './collections/Reservations'
import { ContactMessages } from './collections/ContactMessages'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Settings } from './globals/Settings'
import { Homepage } from './globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: siteUrl(),
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · TAB Jardins' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
  collections: [
    Products,
    Categories,
    Reservations,
    ContactMessages,
    Pages,
    Posts,
    Testimonials,
    Media,
    NewsletterSubscribers,
    Users,
  ],
  globals: [Settings, Homepage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      // DATABASE_URL / POSTGRES_URL sont créées par l'intégration Neon de Vercel.
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  plugins: [
    // Sur Vercel, les médias sont stockés dans Vercel Blob (le disque n'y est pas persistant).
    // En local, sans jeton, ils restent dans le dossier /media.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Envoi direct depuis le navigateur : contourne la limite de 4,5 Mo des fonctions Vercel.
      clientUploads: true,
    }),
  ],
})
