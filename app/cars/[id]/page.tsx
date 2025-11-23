/**
 * Car Detail Page
 * 
 * Server component that fetches and displays individual car listings.
 * Shows all car specifications, images, and details.
 */

import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { Car } from '@/lib/supabase'
import CarDetailsClient from '@/components/CarDetailsClient'

/**
 * Fetch car data from Supabase
 */
async function getCar(id: string): Promise<Car | null> {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null) // Filter out soft-deleted cars
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const car = await getCar(id)

  if (!car) {
    notFound()
  }

  return <CarDetailsClient car={car} />
}
