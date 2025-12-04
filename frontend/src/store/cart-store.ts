import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { medusaApi } from '@/lib/medusa-client'
import { Cart, CartStore } from '@/types'
import toast from 'react-hot-toast'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      createCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await medusaApi.createCart()
          set({ cart: response.cart, isLoading: false })
          return response.cart
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create cart'
          set({ error: errorMessage, isLoading: false })
          throw error
        }
      },

      loadCart: async () => {
        const { cart } = get()
        if (!cart?.id) return

        set({ isLoading: true, error: null })
        try {
          const response = await medusaApi.getCart(cart.id)
          set({ cart: response.cart, isLoading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load cart'
          set({ error: errorMessage, isLoading: false })
          // Se il carrello non esiste più, creane uno nuovo
          if (error instanceof Error && error.message.includes('404')) {
            await get().createCart()
          }
        }
      },

      addItem: async (variantId: string, quantity: number = 1) => {
        let { cart } = get()
        
        // Crea un carrello se non esiste
        if (!cart) {
          cart = await get().createCart()
        }

        set({ isLoading: true, error: null })
        try {
          const response = await medusaApi.addToCart(cart.id, variantId, quantity)
          set({ cart: response.cart, isLoading: false })
          toast.success('Prodotto aggiunto al carrello')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart'
          set({ error: errorMessage, isLoading: false })
          toast.error('Errore nell\'aggiunta al carrello')
          throw error
        }
      },

      updateItem: async (itemId: string, quantity: number) => {
        const { cart } = get()
        if (!cart) return

        set({ isLoading: true, error: null })
        try {
          if (quantity <= 0) {
            await get().removeItem(itemId)
            return
          }

          const response = await medusaApi.updateCartItem(cart.id, itemId, quantity)
          set({ cart: response.cart, isLoading: false })
          toast.success('Carrello aggiornato')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item'
          set({ error: errorMessage, isLoading: false })
          toast.error('Errore nell\'aggiornamento del carrello')
          throw error
        }
      },

      removeItem: async (itemId: string) => {
        const { cart } = get()
        if (!cart) return

        set({ isLoading: true, error: null })
        try {
          const response = await medusaApi.removeFromCart(cart.id, itemId)
          set({ cart: response.cart, isLoading: false })
          toast.success('Prodotto rimosso dal carrello')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart'
          set({ error: errorMessage, isLoading: false })
          toast.error('Errore nella rimozione dal carrello')
          throw error
        }
      },

      clearCart: () => {
        set({ cart: null, error: null })
      },
    }),
    {
      name: 'cromos-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        cart: state.cart ? { id: state.cart.id } : null 
      }),
    }
  )
)

// Hook per ottenere informazioni derivate dal carrello
export const useCartInfo = () => {
  const cart = useCartStore((state) => state.cart)
  
  const itemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
  const subtotal = cart?.subtotal || 0
  const total = cart?.total || 0
  const isEmpty = itemsCount === 0

  return {
    itemsCount,
    subtotal,
    total,
    isEmpty,
    items: cart?.items || []
  }
}
