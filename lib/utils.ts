import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert PKR to USD (approximate rate: 1 USD = 280 PKR)
 */
const PKR_TO_USD_RATE = 280

/**
 * Format price - defaults to PKR, converts to USD only if currency is USD
 * @param price - Price in PKR
 * @param currency - Currency code ('PKR' or 'USD'), defaults to 'PKR'
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'PKR'): string {
  if (currency === 'USD') {
    const usdPrice = price / PKR_TO_USD_RATE
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(usdPrice)
  }
  // Default to PKR
  return `PKR ${price.toLocaleString()}`
}

/**
 * Format price in PKR
 * @param price - Price in PKR
 * @returns Formatted PKR price string
 */
export function formatPricePKR(price: number): string {
  return `PKR ${price.toLocaleString()}`
}

/**
 * Format price in USD (converts from PKR)
 * @param price - Price in PKR
 * @returns Formatted USD price string
 */
export function formatPriceUSD(price: number): string {
  const usdPrice = price / PKR_TO_USD_RATE
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usdPrice)
}

