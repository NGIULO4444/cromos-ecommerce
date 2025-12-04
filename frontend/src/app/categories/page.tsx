import { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import CategoryGrid from '@/components/layout/category-grid'

export const metadata: Metadata = {
  title: 'Categorie - Cromos',
  description: 'Esplora le nostre categorie di prodotti: cover iPhone, cover Samsung, caricatori, auricolari e molto altro.',
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Categorie Prodotti
            </h1>
            <p className="text-lg text-gray-600">
              Trova facilmente quello che cerchi navigando per categoria
            </p>
          </div>

          <Suspense fallback={<CategoriesLoadingSkeleton />}>
            <CategoryGrid />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

function CategoriesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 text-center animate-pulse">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  )
}
