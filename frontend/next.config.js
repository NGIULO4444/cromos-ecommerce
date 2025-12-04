/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**.railway.app',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      // Aggiungi altri domini per immagini se necessario
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  // Ottimizzazioni per performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // PWA e SEO
  generateEtags: false,
  poweredByHeader: false,
  // Rewrite per API
  async rewrites() {
    return [
      {
        source: '/api/medusa/:path*',
        destination: `${process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'}/:path*`,
      },
    ]
  },
  // Headers per sicurezza
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
