'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'

export default function AccountPage() {
  const { customer, isAuthenticated, logout, loadCustomer } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadCustomer()
  }, [isAuthenticated, router, loadCustomer])

  if (!isAuthenticated || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Caricamento...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Il mio Account
              </h1>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informazioni Personali */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Informazioni Personali</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <p className="mt-1 text-gray-900">{customer.first_name || 'Non specificato'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cognome</label>
                    <p className="mt-1 text-gray-900">{customer.last_name || 'Non specificato'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{customer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefono</label>
                    <p className="mt-1 text-gray-900">{customer.phone || 'Non specificato'}</p>
                  </div>
                </div>
                <Button className="mt-6">
                  Modifica Informazioni
                </Button>
              </div>

              {/* Statistiche Account */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Statistiche Account</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Ordini Totali</h3>
                    <p className="text-2xl font-bold text-blue-600">{customer.orders?.length || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Membro dal</h3>
                    <p className="text-gray-600">
                      {new Date(customer.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Indirizzi Salvati</h3>
                    <p className="text-gray-600">{customer.shipping_addresses?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sezioni Aggiuntive */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-semibold mb-2">I miei Ordini</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Visualizza e traccia i tuoi ordini
                </p>
                <Button variant="outline" size="sm">
                  Vedi Ordini
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-semibold mb-2">Indirizzi</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Gestisci i tuoi indirizzi di spedizione
                </p>
                <Button variant="outline" size="sm">
                  Gestisci Indirizzi
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-3xl mb-2">❤️</div>
                <h3 className="font-semibold mb-2">Lista Desideri</h3>
                <p className="text-gray-600 text-sm mb-4">
                  I tuoi prodotti preferiti
                </p>
                <Button variant="outline" size="sm">
                  Vedi Lista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
