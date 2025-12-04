'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { customer, logout } = useAuthStore();
  const { cart } = useCartStore();

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Cromos</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Prodotti
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900">
              Categorie
            </Link>
            
            {customer ? (
              <div className="flex items-center space-x-4">
                <Link href="/account" className="text-gray-700 hover:text-gray-900">
                  Account
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Registrati
                </Link>
              </div>
            )}

            <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h12" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Prodotti
              </Link>
              <Link href="/categories" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Categorie
              </Link>
              {customer ? (
                <>
                  <Link href="/account" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                    Account
                  </Link>
                  <button
                    onClick={logout}
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                    Login
                  </Link>
                  <Link href="/register" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                    Registrati
                  </Link>
                </>
              )}
              <Link href="/cart" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Carrello ({cartItemsCount})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
