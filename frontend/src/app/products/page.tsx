import { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import FeaturedProducts from '@/components/product/featured-products'

export const metadata: Metadata = {
  title: 'Prodotti - Cromos',
  description: 'Scopri tutti i nostri prodotti per smartphone: cover, pellicole, caricatori e accessori di qualità.',
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tutti i Prodotti
            </h1>
            <p className="text-lg text-gray-600">
              Scopri la nostra collezione completa di accessori per smartphone
            </p>
          </div>

          <Suspense fallback={<ProductsLoadingSkeleton />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  )
}
