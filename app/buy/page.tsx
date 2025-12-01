import type { Metadata } from 'next'
import BuyPageClient from './BuyPageClient'

export const metadata: Metadata = {
  title: 'Buy Cars - AutoHub',
  description: 'Browse our selection of quality vehicles. Find your perfect car with advanced filters and search.',
  openGraph: {
    title: 'Buy Cars - AutoHub',
    description: 'Browse our selection of quality vehicles. Find your perfect car with advanced filters and search.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BuyPage() {
  return <BuyPageClient />
}
