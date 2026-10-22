import { withPayload } from '@payloadcms/next/withPayload'
import { legacyRedirects } from './redirects.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  async redirects() {
    return legacyRedirects
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
