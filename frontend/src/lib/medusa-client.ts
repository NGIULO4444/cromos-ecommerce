import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
})

// Helper functions per API calls comuni
export const medusaApi = {
  // Products
  async getProducts(params?: {
    limit?: number
    offset?: number
    category_id?: string[]
    collection_id?: string[]
    type_id?: string[]
    tags?: string[]
    q?: string
  }) {
    try {
      const response = await medusaClient.products.list(params)
      return response
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  },

  async getProduct(id: string) {
    try {
      const response = await medusaClient.products.retrieve(id)
      return response
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  },

  async getProductByHandle(handle: string) {
    try {
      const response = await medusaClient.products.list({ handle })
      return response.products[0] || null
    } catch (error) {
      console.error("Error fetching product by handle:", error)
      throw error
    }
  },

  // Categories
  async getCategories() {
    try {
      const response = await medusaClient.productCategories.list()
      return response
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },

  async getCategory(id: string) {
    try {
      const response = await medusaClient.productCategories.retrieve(id)
      return response
    } catch (error) {
      console.error("Error fetching category:", error)
      throw error
    }
  },

  // Collections
  async getCollections() {
    try {
      const response = await medusaClient.collections.list()
      return response
    } catch (error) {
      console.error("Error fetching collections:", error)
      throw error
    }
  },

  async getCollection(id: string) {
    try {
      const response = await medusaClient.collections.retrieve(id)
      return response
    } catch (error) {
      console.error("Error fetching collection:", error)
      throw error
    }
  },

  // Cart
  async createCart(regionId?: string) {
    try {
      const response = await medusaClient.carts.create({
        region_id: regionId
      })
      return response
    } catch (error) {
      console.error("Error creating cart:", error)
      throw error
    }
  },

  async getCart(cartId: string) {
    try {
      const response = await medusaClient.carts.retrieve(cartId)
      return response
    } catch (error) {
      console.error("Error fetching cart:", error)
      throw error
    }
  },

  async addToCart(cartId: string, variantId: string, quantity: number) {
    try {
      const response = await medusaClient.carts.lineItems.create(cartId, {
        variant_id: variantId,
        quantity
      })
      return response
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  },

  async updateCartItem(cartId: string, itemId: string, quantity: number) {
    try {
      const response = await medusaClient.carts.lineItems.update(cartId, itemId, {
        quantity
      })
      return response
    } catch (error) {
      console.error("Error updating cart item:", error)
      throw error
    }
  },

  async removeFromCart(cartId: string, itemId: string) {
    try {
      const response = await medusaClient.carts.lineItems.delete(cartId, itemId)
      return response
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  },

  // Regions
  async getRegions() {
    try {
      const response = await medusaClient.regions.list()
      return response
    } catch (error) {
      console.error("Error fetching regions:", error)
      throw error
    }
  },

  // Shipping
  async getShippingOptions(cartId: string) {
    try {
      const response = await medusaClient.shippingOptions.listCartOptions(cartId)
      return response
    } catch (error) {
      console.error("Error fetching shipping options:", error)
      throw error
    }
  },

  async addShippingMethod(cartId: string, optionId: string) {
    try {
      const response = await medusaClient.carts.addShippingMethod(cartId, {
        option_id: optionId
      })
      return response
    } catch (error) {
      console.error("Error adding shipping method:", error)
      throw error
    }
  },

  // Payment
  async createPaymentSessions(cartId: string) {
    try {
      const response = await medusaClient.carts.createPaymentSessions(cartId)
      return response
    } catch (error) {
      console.error("Error creating payment sessions:", error)
      throw error
    }
  },

  async setPaymentSession(cartId: string, providerId: string) {
    try {
      const response = await medusaClient.carts.setPaymentSession(cartId, {
        provider_id: providerId
      })
      return response
    } catch (error) {
      console.error("Error setting payment session:", error)
      throw error
    }
  },

  async completeCart(cartId: string) {
    try {
      const response = await medusaClient.carts.complete(cartId)
      return response
    } catch (error) {
      console.error("Error completing cart:", error)
      throw error
    }
  },

  // Customer
  async createCustomer(data: {
    first_name: string
    last_name: string
    email: string
    password: string
    phone?: string
  }) {
    try {
      const response = await medusaClient.customers.create(data)
      return response
    } catch (error) {
      console.error("Error creating customer:", error)
      throw error
    }
  },

  async authenticateCustomer(email: string, password: string) {
    try {
      const response = await medusaClient.auth.authenticate({
        email,
        password
      })
      return response
    } catch (error) {
      console.error("Error authenticating customer:", error)
      throw error
    }
  },

  async getCustomer() {
    try {
      const response = await medusaClient.customers.retrieve()
      return response
    } catch (error) {
      console.error("Error fetching customer:", error)
      throw error
    }
  },

  async updateCustomer(data: Partial<{
    first_name: string
    last_name: string
    phone: string
    billing_address: any
  }>) {
    try {
      const response = await medusaClient.customers.update(data)
      return response
    } catch (error) {
      console.error("Error updating customer:", error)
      throw error
    }
  },

  // Orders
  async getCustomerOrders(limit?: number, offset?: number) {
    try {
      const response = await medusaClient.customers.orders.list({
        limit,
        offset
      })
      return response
    } catch (error) {
      console.error("Error fetching customer orders:", error)
      throw error
    }
  },

  async getOrder(id: string) {
    try {
      const response = await medusaClient.orders.retrieve(id)
      return response
    } catch (error) {
      console.error("Error fetching order:", error)
      throw error
    }
  },

  // Custom Inventory API
  async checkInventory(sku: string) {
    try {
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/inventory/check?sku=${sku}`)
      if (!response.ok) {
        throw new Error("Failed to check inventory")
      }
      return await response.json()
    } catch (error) {
      console.error("Error checking inventory:", error)
      throw error
    }
  },

  async bulkCheckInventory(items: Array<{ sku?: string; variant_id?: string; quantity: number }>) {
    try {
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/inventory/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
      })
      if (!response.ok) {
        throw new Error("Failed to check inventory")
      }
      return await response.json()
    } catch (error) {
      console.error("Error bulk checking inventory:", error)
      throw error
    }
  }
}

export default medusaClient
