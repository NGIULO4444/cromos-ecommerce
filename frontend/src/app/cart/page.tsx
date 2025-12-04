'use client';

import { Metadata } from 'next'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart-store'

export default function CartPage() {
  const { cart, isLoading, loadCart, updateItem, removeItem } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCart()
  }, [loadCart])

  if (!mounted) {
    return <CartLoadingSkeleton />
  }

  const cartItems = cart?.items || []
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.unit_price * item.quantity)
  }, 0)

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Il tuo Carrello
          </h1>

          {isLoading ? (
            <CartLoadingSkeleton />
          ) : cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                          <img
                            src={item.thumbnail || '/placeholder-product.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            {formatPrice(item.unit_price)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateItem(item.id, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Rimuovi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-semibold mb-4">Riepilogo Ordine</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotale</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spedizione</span>
                      <span>Gratuita</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Totale</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mb-4">
                    Procedi al Checkout
                  </Button>
                  
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continua Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-semibold mb-4">Il tuo carrello è vuoto</h2>
      <p className="text-gray-600 mb-8">
        Aggiungi alcuni prodotti per iniziare lo shopping!
      </p>
      <Link href="/products">
        <Button size="lg">
          Inizia a fare Shopping
        </Button>
      </Link>
    </div>
  )
}

function CartLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="w-24 h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
