import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CarCard from '@/components/CarCard'
import { createServerSupabase } from '@/lib/supabase/server'
import { Car } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AutoHub - Buy & Sell Cars in Pakistan',
  description: 'Your trusted marketplace for buying and selling cars in Pakistan. Browse quality vehicles or list your car today.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'AutoHub - Buy & Sell Cars in Pakistan',
    description: 'Your trusted marketplace for buying and selling cars in Pakistan.',
    type: 'website',
  },
}

async function getFeaturedCars(): Promise<Car[]> {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching featured cars:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getFeaturedCars:', error)
    return []
  }
}

export default async function Home() {
  const featuredCars = await getFeaturedCars()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to AutoHub</h1>
          <p className="text-xl mb-8 text-blue-100">
            Your trusted marketplace for buying and selling cars
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/buy">
              <Button size="lg" variant="secondary">
                Browse Cars
              </Button>
            </Link>
            <Link href="/sell">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Sell Your Car
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Cars</h2>
          <Link href="/buy">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No cars available yet. Be the first to list your car!
            </p>
            <Link href="/sell">
              <Button>List Your Car</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AutoHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-muted-foreground">
                Browse thousands of cars from trusted sellers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">
                Find great deals on your dream car
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Easy Process</h3>
              <p className="text-muted-foreground">
                Simple and secure buying and selling experience
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

