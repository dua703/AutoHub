'use client'

import { useEffect, useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { useAuth } from '@/contexts/AuthContext'
import { createClientSupabase } from '@/lib/supabase/client'
import { Car } from '@/lib/supabase'
import CarCard from '@/components/CarCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function FavoritesPageClient() {
  const { loading: authLoading } = useRequireAuth()
  const { user } = useAuth()
  const supabase = createClientSupabase()
  const toast = useToast()
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && !authLoading) {
      fetchFavorites()
    }
  }, [user, authLoading])

  const fetchFavorites = async () => {
    if (!user?.id) return

    try {
      const { data: favoritesWithCars, error: favError } = await supabase
        .from('favorites')
        .select(`
          car_id,
          cars (
            id,
            title,
            name,
            make,
            model,
            year,
            price,
            price_currency,
            images,
            mileage,
            fuel_type,
            transmission,
            color,
            condition,
            body_type,
            description,
            location,
            reg_city,
            registration_city,
            engine_type,
            engine_capacity,
            assembly,
            category,
            user_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)

      if (favError) throw favError

      if (!favoritesWithCars || favoritesWithCars.length === 0) {
        setFavoriteCars([])
        setLoading(false)
        return
      }

      const cars = favoritesWithCars
        .map((f: any) => f.cars)
        .filter((car: Car | null) => {
          if (!car) return false
          if (car.deleted_at) return false
          return true
        }) as Car[]

      setFavoriteCars(cars || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Loading favorites...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 fill-red-500 text-red-500" />
          My Favorites
        </h1>
        <p className="text-muted-foreground">
          Cars you've saved for later
        </p>
      </div>

      {favoriteCars.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              You haven't saved any favorites yet.
            </p>
            <Button asChild>
              <a href="/buy">Browse Cars</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {favoriteCars.length} favorite{favoriteCars.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

