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

/**
 * Convert number to words (Pakistani format: Lakh, Crore)
 * @param num - Number to convert
 * @returns Price in words (e.g., "Seventeen Lakh")
 */
export function numberToWords(num: number): string {
  if (num === 0) return 'Zero'
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  
  function convertHundreds(n: number): string {
    let result = ''
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' '
      n %= 10
    } else if (n >= 10) {
      result += teens[n - 10] + ' '
      return result.trim()
    }
    
    if (n > 0) {
      result += ones[n] + ' '
    }
    
    return result.trim()
  }
  
  // Handle Crore (10,000,000)
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000)
    const remainder = num % 10000000
    let result = convertHundreds(crores) + ' Crore'
    if (remainder > 0) {
      result += ' ' + numberToWords(remainder)
    }
    return result
  }
  
  // Handle Lakh (100,000)
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000)
    const remainder = num % 100000
    let result = convertHundreds(lakhs) + ' Lakh'
    if (remainder > 0) {
      result += ' ' + numberToWords(remainder)
    }
    return result
  }
  
  // Handle Thousand (1,000)
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    let result = convertHundreds(thousands) + ' Thousand'
    if (remainder > 0) {
      result += ' ' + convertHundreds(remainder)
    }
    return result
  }
  
  return convertHundreds(num)
}