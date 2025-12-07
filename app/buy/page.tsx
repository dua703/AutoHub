import type { Metadata } from 'next'
import BuyPageClient from './BuyPageClient'
import { createServerSupabase } from '@/lib/supabase/server'
import { Car } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Buy Cars - AutoHub',
  description: 'Browse our selection of quality vehicles. Find your perfect car with advanced filters and search.',
  openGraph: {
    title: 'Buy Cars - AutoHub',
    description: 'Browse our selection of quality vehicles. Find your perfect car with advanced filters and search.',
    type: 'website',
    url: 'https://autohubpk.com/buy',
    siteName: 'AutoHub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://autohubpk.com/buy',
  },
}

async function getCars(): Promise<Car[]> {
  try {
    const supabase = await createServerSupabase()
    
    // Add timeout to prevent hanging during crawl
    const timeoutPromise = new Promise<Car[]>((resolve) => {
      setTimeout(() => resolve([]), 5000) // 5 second timeout
    })
    
    const fetchPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching cars:', error)
          return []
        }
        return data || []
      } catch (error) {
        console.error('Error in getCars:', error)
        return []
      }
    })()

    return Promise.race([fetchPromise, timeoutPromise])
  } catch (error) {
    console.error('Error in getCars:', error)
    return []
  }
}

export default async function BuyPage() {
  const initialCars = await getCars()
  return <BuyPageClient initialCars={initialCars} />
}
