import { Suspense } from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/layout/hero-section'
import { FeaturedProducts } from '@/components/product/featured-products'
import { CategoryGrid } from '@/components/layout/category-grid'
import { NewsletterSection } from '@/components/layout/newsletter-section'
import { TrustBadges } from '@/components/layout/trust-badges'

export const metadata: Metadata = {
  title: 'Cromos - Accessori Telefonia Online',
  description: 'Scopri la nostra selezione di accessori per smartphone: cover, pellicole protettive, caricatori e molto altro. Spedizione gratuita e garanzia qualità.',
  openGraph: {
    title: 'Cromos - Accessori Telefonia Online',
    description: 'Scopri la nostra selezione di accessori per smartphone: cover, pellicole protettive, caricatori e molto altro.',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Cromos Homepage',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Trust Badges */}
        <TrustBadges />
        
        {/* Featured Products */}
        <section className="section-padding bg-gray-50">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Prodotti in Evidenza
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                I nostri accessori più popolari e le ultime novità
              </p>
            </div>
            <Suspense fallback={<FeaturedProductsSkeleton />}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </section>
        
        {/* Category Grid */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Categorie Prodotti
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Trova l'accessorio perfetto per il tuo smartphone
              </p>
            </div>
            <Suspense fallback={<CategoryGridSkeleton />}>
              <CategoryGrid />
            </Suspense>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
      
      <Footer />
    </div>
  )
}

// Loading Skeletons
function FeaturedProductsSkeleton() {
  return (
    <div className="product-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card p-4">
          <div className="skeleton-image mb-4" />
          <div className="skeleton-title mb-2" />
          <div className="skeleton-text mb-2" />
          <div className="skeleton-text w-1/2" />
        </div>
      ))}
    </div>
  )
}

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card p-6">
          <div className="skeleton aspect-video mb-4" />
          <div className="skeleton-title mb-2" />
          <div className="skeleton-text" />
        </div>
      ))}
    </div>
  )
}
