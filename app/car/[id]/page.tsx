import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServerSupabase } from '@/lib/supabase/server'
import { Car } from '@/lib/supabase'
import CarDetailsClient from '@/components/CarDetailsClient'

async function getCar(id: string): Promise<Car | null> {
  if (!id || typeof id !== 'string') {
    return null
  }

  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) {
      console.error('Error fetching car:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getCar:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const car = await getCar(id)

  if (!car) {
    return {
      title: 'Car Not Found - AutoHub',
    }
  }

  const carTitle = car.title || car.name || 'Car Listing'
  const description = car.description 
    ? car.description.substring(0, 160) 
    : `View details for ${carTitle} on AutoHub`

  return {
    title: `${carTitle} - AutoHub`,
    description,
    openGraph: {
      title: `${carTitle} - AutoHub`,
      description,
      type: 'website',
      images: car.images && car.images.length > 0 ? [car.images[0]] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  if (!id) {
    notFound()
  }

  const car = await getCar(id)

  if (!car) {
    notFound()
  }

  return <CarDetailsClient car={car} />
}
