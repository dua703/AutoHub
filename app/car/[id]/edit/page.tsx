'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { createClientSupabase } from '@/lib/supabase/client'
import { Car } from '@/lib/supabase'
import { CarFormWithAuth } from '@/components/CarForm'

export default function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <ProtectedRoute>
      <EditCarContent params={params} />
    </ProtectedRoute>
  )
}

function EditCarContent({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientSupabase()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [carId, setCarId] = useState<string>('')

  useEffect(() => {
    async function loadCar() {
      const resolvedParams = await params
      const id = resolvedParams.id
      setCarId(id)

      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .is('deleted_at', null) // Filter out soft-deleted cars
          .single()

        if (error) throw error

        if (!data) {
          // Car not found or was deleted
          router.push('/dashboard')
          return
        }

        setCar(data)
      } catch (error) {
        console.error('Error loading car:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadCar()
    }
  }, [user])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg">Loading car details...</p>
      </div>
    )
  }

  if (!car) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Edit Car Listing</h1>
        <p className="text-muted-foreground">
          Update your car listing information
        </p>
      </div>

      <div className="bg-white rounded-lg border p-8 max-w-2xl mx-auto">
        <CarFormWithAuth
          carId={carId}
          initialData={{
            name: car.name || car.title || '',
            price: car.price.toString(),
            description: car.description,
            images: car.images,
          }}
        />
      </div>
    </div>
  )
}
