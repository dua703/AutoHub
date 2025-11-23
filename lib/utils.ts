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
 * Format price in USD (converts from PKR)
 * @param price - Price in PKR
 * @returns Formatted USD price string
 */
export function formatPrice(price: number): string {
  const usdPrice = price / PKR_TO_USD_RATE
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usdPrice)
}

/**
 * Format price in PKR
 * @param price - Price in PKR
 * @returns Formatted PKR price string
 */
export function formatPricePKR(price: number): string {
  return `PKR ${price.toLocaleString()}`
}

