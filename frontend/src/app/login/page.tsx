'use client';

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      router.push('/account')
    } catch (error) {
      // Error is handled by the store and toast
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-8">
              Accedi al tuo Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="La tua email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="La tua password"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Accesso in corso...' : 'Accedi'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Non hai un account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Registrati qui
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Hai dimenticato la password?
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
