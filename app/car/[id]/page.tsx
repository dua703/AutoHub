import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { Car } from '@/lib/supabase'
import CarDetailsClient from '@/components/CarDetailsClient'

async function getCar(id: string): Promise<Car | null> {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
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
