// Medusa Types Extensions
export interface Product {
  id: string
  title: string
  subtitle?: string
  description?: string
  handle: string
  is_giftcard: boolean
  status: string
  thumbnail?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  collection_id?: string
  type_id?: string
  discountable: boolean
  external_id?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  variants: ProductVariant[]
  options: ProductOption[]
  images: ProductImage[]
  collection?: ProductCollection
  type?: ProductType
  tags?: ProductTag[]
  categories?: ProductCategory[]
  // Extended fields
  extended?: ProductExtended
}

export interface ProductExtended {
  phone_brand?: string
  phone_model?: string
  compatibility?: string
  accessory_type?: string
  material?: string
  color?: string
  size?: string
  wireless_charging_compatible?: boolean
  connector_type?: string
  cable_length?: string
  power_output?: string
  fast_charging?: boolean
  screen_size?: string
  protection_level?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  is_featured?: boolean
  is_bestseller?: boolean
  is_new_arrival?: boolean
}

export interface ProductVariant {
  id: string
  title: string
  product_id: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  variant_rank?: number
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  prices: ProductVariantPrice[]
  options: ProductOptionValue[]
  product: Product
}

export interface ProductVariantPrice {
  id: string
  currency_code: string
  amount: number
  variant_id: string
  region_id?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface ProductOption {
  id: string
  title: string
  product_id: string
  created_at: string
  updated_at: string
  deleted_at?: string
  values: ProductOptionValue[]
}

export interface ProductOptionValue {
  id: string
  value: string
  option_id: string
  variant_id: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface ProductImage {
  id: string
  url: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
}

export interface ProductCollection {
  id: string
  title: string
  handle: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
}

export interface ProductCategory {
  id: string
  name: string
  handle: string
  parent_category_id?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
}

export interface ProductType {
  id: string
  value: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface ProductTag {
  id: string
  value: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

// Cart Types
export interface CartItem {
  id: string
  cart_id: string
  variant_id: string
  quantity: number
  unit_price: number
  total: number
  created_at: string
  updated_at: string
  variant: ProductVariant
}

export interface Cart {
  id: string
  email?: string
  billing_address_id?: string
  shipping_address_id?: string
  region_id: string
  customer_id?: string
  payment_session?: any
  type: string
  completed_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  items: CartItem[]
  region: Region
  shipping_methods: ShippingMethod[]
  payment_sessions: PaymentSession[]
  shipping_address?: Address
  billing_address?: Address
  discounts: Discount[]
  customer?: Customer
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  total: number
}

// Customer Types
export interface Customer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  billing_address_id?: string | null
  phone?: string
  has_account: boolean
  created_at: string | Date
  updated_at: string | Date
  deleted_at?: string | Date | null
  metadata?: Record<string, any>
  billing_address?: Address
  shipping_addresses: Address[]
  orders: Order[]
}

export interface Address {
  id: string
  customer_id?: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  phone?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
}

// Order Types
export interface Order {
  id: string
  status: string
  fulfillment_status: string
  payment_status: string
  display_id: number
  cart_id: string
  customer_id: string
  email: string
  billing_address_id: string
  shipping_address_id: string
  region_id: string
  currency_code: string
  tax_rate?: number
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  items: OrderItem[]
  customer: Customer
  billing_address: Address
  shipping_address: Address
  region: Region
  discounts: Discount[]
  fulfillments: Fulfillment[]
  payments: Payment[]
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  total: number
}

export interface OrderItem {
  id: string
  order_id: string
  variant_id: string
  title: string
  description?: string
  thumbnail?: string
  is_return: boolean
  is_giftcard: boolean
  should_merge: boolean
  allow_discounts: boolean
  has_shipping: boolean
  unit_price: number
  quantity: number
  fulfilled_quantity?: number
  returned_quantity?: number
  shipped_quantity?: number
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  variant: ProductVariant
}

// Region & Shipping
export interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
  tax_code?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  countries: Country[]
  payment_providers: PaymentProvider[]
  fulfillment_providers: FulfillmentProvider[]
}

export interface Country {
  id: string
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
  region_id?: string
}

export interface ShippingMethod {
  id: string
  shipping_option_id: string
  order_id?: string
  cart_id?: string
  swap_id?: string
  return_id?: string
  claim_order_id?: string
  price: number
  data: Record<string, any>
  created_at: string
  updated_at: string
  shipping_option: ShippingOption
}

export interface ShippingOption {
  id: string
  name: string
  region_id: string
  profile_id: string
  provider_id: string
  price_type: string
  amount?: number
  is_return: boolean
  admin_only: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
}

// Payment
export interface PaymentSession {
  id: string
  cart_id: string
  provider_id: string
  is_selected: boolean
  status: string
  data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  swap_id?: string
  cart_id?: string
  order_id?: string
  amount: number
  currency_code: string
  amount_refunded: number
  provider_id: string
  data: Record<string, any>
  captured_at?: string
  canceled_at?: string
  created_at: string
  updated_at: string
}

export interface PaymentProvider {
  id: string
  is_installed: boolean
}

export interface FulfillmentProvider {
  id: string
  is_installed: boolean
}

export interface Fulfillment {
  id: string
  claim_order_id?: string
  swap_id?: string
  order_id?: string
  provider_id: string
  location_id?: string
  shipped_at?: string
  canceled_at?: string
  data: Record<string, any>
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

// Discounts
export interface Discount {
  id: string
  code: string
  is_dynamic: boolean
  rule_id: string
  is_disabled: boolean
  parent_discount_id?: string
  starts_at: string
  ends_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  rule: DiscountRule
}

export interface DiscountRule {
  id: string
  description?: string
  type: string
  value: number
  allocation?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
}

// UI Types
export interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

export interface SortOption {
  id: string
  label: string
  value: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ListResponse<T> {
  data: T[]
  count: number
  offset: number
  limit: number
}

// Form Types
export interface CheckoutFormData {
  email: string
  shipping_address: Omit<Address, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
  billing_address: Omit<Address, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
  same_as_shipping: boolean
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

// Store Types (Zustand)
export interface CartStore {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
  loadCart: () => Promise<void>
  createCart: () => Promise<any>
}

export interface AuthStore {
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  logout: () => void
  loadCustomer: () => Promise<void>
}

// Inventory Types
export interface InventoryCheck {
  sku: string
  variant_id: string
  available: boolean
  quantity: number
  total_quantity: number
  reserved_quantity: number
}
