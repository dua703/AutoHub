import { notFound } from 'next/navigation'
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
