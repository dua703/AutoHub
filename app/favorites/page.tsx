import type { Metadata } from 'next'
import FavoritesPageClient from './FavoritesPageClient'

export const metadata: Metadata = {
  title: 'My Favorites - AutoHub',
  description: 'View and manage your favorite car listings on AutoHub.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'My Favorites - AutoHub',
    description: 'View and manage your favorite car listings on AutoHub.',
    type: 'website',
  },
}

export default function FavoritesPage() {
  return <FavoritesPageClient />
}




