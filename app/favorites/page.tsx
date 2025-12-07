import type { Metadata } from 'next'
import FavoritesPageClient from './FavoritesPageClient'

export const metadata: Metadata = {
  title: 'My Favorites - AutoHub',
  description: 'View and manage your favorite car listings on AutoHub.',
  openGraph: {
    title: 'My Favorites - AutoHub',
    description: 'View and manage your favorite car listings on AutoHub.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function FavoritesPage() {
  return <FavoritesPageClient />
}




