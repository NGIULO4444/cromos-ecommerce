/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  // Configurazione semplificata per il deploy
  poweredByHeader: false,
  // Disabilitiamo temporaneamente le ottimizzazioni avanzate
  swcMinify: true,
  compiler: {
    removeConsole: false, // Disabilitiamo per il debug
  },
  // Disabilitiamo il build trace per evitare l'errore di stack overflow
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
  outputFileTracing: false,
}

module.exports = nextConfig