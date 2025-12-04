import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Cromos - E-commerce Accessori Telefonia',
    template: '%s | Cromos'
  },
  description: 'Il tuo e-commerce di fiducia per accessori telefonia. Cover, pellicole, caricatori e molto altro per tutti i modelli di smartphone.',
  keywords: ['accessori telefonia', 'cover smartphone', 'pellicole protettive', 'caricatori', 'e-commerce'],
  authors: [{ name: 'Cromos Team' }],
  creator: 'Cromos',
  publisher: 'Cromos',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Cromos',
    title: 'Cromos - E-commerce Accessori Telefonia',
    description: 'Il tuo e-commerce di fiducia per accessori telefonia. Cover, pellicole, caricatori e molto altro.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cromos - Accessori Telefonia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cromos - E-commerce Accessori Telefonia',
    description: 'Il tuo e-commerce di fiducia per accessori telefonia.',
    images: ['/images/og-image.jpg'],
    creator: '@cromos',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
