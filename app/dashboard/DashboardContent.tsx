'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { createClientSupabase } from '@/lib/supabase/client'
import { Car, Review } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Edit, Plus, MessageSquare } from 'lucide-react'

export default function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClientSupabase()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (user) {
      fetchCars()
    }
  }, [user])

  const fetchCars = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCars(data || [])
      
      // Fetch review counts for each car
      if (data && data.length > 0) {
        const carIds = data.map(car => car.id)
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('car_id')
          .in('car_id', carIds)
        
        if (!reviewsError && reviewsData) {
          const counts: Record<string, number> = {}
          reviewsData.forEach((review) => {
            counts[review.car_id] = (counts[review.car_id] || 0) + 1
          })
          setReviewCounts(counts)
        }
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
      alert('Failed to load cars. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car listing?')) {
      return
    }

    const previousCars = [...cars]
    setCars(cars.filter((car) => car.id !== carId))

    try {
      const { error: favError } = await supabase
        .from('favorites')
        .delete()
        .eq('car_id', carId)

      if (favError) {
        console.warn('Error removing from favorites:', favError)
      }

      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId)
        .eq('user_id', user?.id)

      if (error) {
        setCars(previousCars)
        throw error
      }

      router.refresh()
    } catch (error: any) {
      console.error('Error deleting car:', error)
      alert(error.message || 'Failed to delete car. Please try again.')
      setCars(previousCars)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-base sm:text-lg">Loading your cars...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your car listings
          </p>
        </div>
        <Link href="/sell" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base touch-manipulation">
            <Plus className="mr-2 h-4 w-4" />
            Add New Car
          </Button>
        </Link>
      </div>

      {cars.length === 0 ? (
        <Card>
          <CardContent className="py-12 sm:py-16 text-center px-4">
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              You haven't listed any cars yet.
            </p>
            <Link href="/sell">
              <Button className="h-10 sm:h-11 text-sm sm:text-base touch-manipulation">
                Post Your First Car
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {cars.map((car) => {
            const mainImage = car.images && car.images.length > 0 ? car.images[0] : null
            const carTitle = car.title || car.name || 'Untitled Car'

            return (
              <Card
                key={car.id}
                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative h-48 sm:h-56 w-full bg-gray-200">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={carTitle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm sm:text-base">
                      No Image
                    </div>
                  )}
                </div>

                <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-2 flex-1">
                      {carTitle}
                    </h3>
                    {(reviewCounts[car.id] || 0) > 0 && (
                      <Link 
                        href={`/car/${car.id}#reviews`}
                        className="ml-2 flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
                        title="View reviews"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>{reviewCounts[car.id]}</span>
                      </Link>
                    )}
                  </div>

                  <p className="text-xl sm:text-2xl font-bold text-primary mb-3">
                    PKR {car.price.toLocaleString()}
                  </p>

                  <div className="space-y-1 mb-3 text-xs sm:text-sm text-muted-foreground">
                    {car.year && car.make && car.model && (
                      <p>{car.year} • {car.make} {car.model}</p>
                    )}
                    {car.mileage && (
                      <p>Mileage: {car.mileage.toLocaleString()} km</p>
                    )}
                    {car.transmission && (
                      <p>Transmission: {car.transmission}</p>
                    )}
                    {car.fuel_type && (
                      <p>Fuel: {car.fuel_type}</p>
                    )}
                    {car.condition && (
                      <p>Condition: {car.condition}</p>
                    )}
                    {(car.registration_city || car.reg_city) && (
                      <p>📍 {car.registration_city || car.reg_city}</p>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {car.description || 'No description provided.'}
                  </p>

                  {user?.id === car.user_id && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <Link href={`/car/${car.id}`} className="flex-1">
                        <Button variant="outline" className="w-full h-9 sm:h-10 text-xs sm:text-sm touch-manipulation">
                          View
                        </Button>
                      </Link>
                      <Link href={`/car/${car.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full h-9 sm:h-10 text-xs sm:text-sm touch-manipulation">
                          <Edit className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(car.id)}
                        className="h-9 sm:h-10 w-full sm:w-auto touch-manipulation"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

