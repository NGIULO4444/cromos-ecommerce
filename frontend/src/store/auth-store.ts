import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { medusaApi } from '@/lib/medusa-client'
import { AuthStore, Customer, RegisterFormData } from '@/types'
import toast from 'react-hot-toast'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await medusaApi.authenticateCustomer(email, password)
          
          // Carica i dati completi del customer
          const customerResponse = await medusaApi.getCustomer()
          
          set({ 
            customer: customerResponse.customer as any, 
            isAuthenticated: true, 
            isLoading: false 
          })
          
          toast.success('Login effettuato con successo')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed'
          set({ error: errorMessage, isLoading: false })
          toast.error('Credenziali non valide')
          throw error
        }
      },

      register: async (data: RegisterFormData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await medusaApi.createCustomer(data)
          
          // Effettua automaticamente il login dopo la registrazione
          await get().login(data.email, data.password)
          
          toast.success('Registrazione completata con successo')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed'
          set({ error: errorMessage, isLoading: false })
          toast.error('Errore durante la registrazione')
          throw error
        }
      },

      logout: () => {
        set({ 
          customer: null, 
          isAuthenticated: false, 
          error: null 
        })
        
        // Pulisci anche il localStorage del carrello se necessario
        localStorage.removeItem('cromos-cart-storage')
        
        toast.success('Logout effettuato')
      },

      loadCustomer: async () => {
        const { isAuthenticated } = get()
        if (!isAuthenticated) return

        set({ isLoading: true, error: null })
        try {
          const response = await medusaApi.getCustomer()
          set({ 
            customer: response.customer as any, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error) {
          // Se il token è scaduto o non valido, effettua il logout
          set({ 
            customer: null, 
            isAuthenticated: false, 
            error: null, 
            isLoading: false 
          })
        }
      },

      updateCustomer: async (data: Partial<Customer>) => {
        const { customer } = get()
        if (!customer) return

        set({ isLoading: true, error: null })
        try {
          const response = await medusaApi.updateCustomer(data)
          set({ 
            customer: response.customer as any, 
            isLoading: false 
          })
          toast.success('Profilo aggiornato con successo')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update customer'
          set({ error: errorMessage, isLoading: false })
          toast.error('Errore nell\'aggiornamento del profilo')
          throw error
        }
      },
    }),
    {
      name: 'cromos-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        customer: state.customer
      }),
    }
  )
)

// Hook per verificare se l'utente è autenticato
export const useAuth = () => {
  const { customer, isAuthenticated, isLoading } = useAuthStore()
  
  return {
    customer,
    isAuthenticated,
    isLoading,
    isGuest: !isAuthenticated
  }
}
