import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currencyCode: string = 'EUR'): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount / 100) // Medusa stores prices in cents
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getImageUrl(url?: string, fallback?: string): string {
  if (!url) return fallback || '/images/placeholder.jpg'
  
  // Se l'URL è già completo, restituiscilo così com'è
  if (url.startsWith('http')) return url
  
  // Altrimenti, costruisci l'URL completo
  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

export function generateSEOTitle(title: string, siteName: string = 'Cromos'): string {
  return `${title} | ${siteName}`
}

export function generateSEODescription(description: string, maxLength: number = 160): string {
  return truncate(description, maxLength)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function generateOrderNumber(id: string): string {
  return `CR-${id.slice(-8).toUpperCase()}`
}

export function getVariantPrice(variant: any, regionId?: string): number {
  if (!variant.prices || variant.prices.length === 0) return 0
  
  // Trova il prezzo per la regione specifica o il primo disponibile
  const price = regionId 
    ? variant.prices.find((p: any) => p.region_id === regionId)
    : variant.prices[0]
  
  return price?.amount || 0
}

export function getProductMinPrice(product: any, regionId?: string): number {
  if (!product.variants || product.variants.length === 0) return 0
  
  const prices = product.variants.map((variant: any) => 
    getVariantPrice(variant, regionId)
  ).filter((price: number) => price > 0)
  
  return prices.length > 0 ? Math.min(...prices) : 0
}

export function getProductMaxPrice(product: any, regionId?: string): number {
  if (!product.variants || product.variants.length === 0) return 0
  
  const prices = product.variants.map((variant: any) => 
    getVariantPrice(variant, regionId)
  ).filter((price: number) => price > 0)
  
  return prices.length > 0 ? Math.max(...prices) : 0
}

export function hasMultiplePrices(product: any, regionId?: string): boolean {
  const minPrice = getProductMinPrice(product, regionId)
  const maxPrice = getProductMaxPrice(product, regionId)
  return minPrice !== maxPrice && minPrice > 0 && maxPrice > 0
}

export function getStockStatus(quantity: number): {
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  label: string
  color: string
} {
  if (quantity === 0) {
    return {
      status: 'out_of_stock',
      label: 'Esaurito',
      color: 'text-red-600'
    }
  } else if (quantity <= 5) {
    return {
      status: 'low_stock',
      label: `Solo ${quantity} disponibili`,
      color: 'text-orange-600'
    }
  } else {
    return {
      status: 'in_stock',
      label: 'Disponibile',
      color: 'text-green-600'
    }
  }
}

export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function generateBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ label: 'Home', href: '/' }]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
    breadcrumbs.push({ label, href: currentPath })
  })
  
  return breadcrumbs
}

export function shareProduct(product: any, url: string) {
  if (navigator.share) {
    navigator.share({
      title: product.title,
      text: product.description,
      url: url,
    })
  } else {
    // Fallback: copia URL negli appunti
    navigator.clipboard.writeText(url)
  }
}
