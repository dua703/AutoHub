import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Car } from '@/lib/supabase'
import FavoriteButton from './FavoriteButton'

interface CarCardProps {
  car: Car
}

export default function CarCard({ car }: CarCardProps) {
  const mainImage = car.images && car.images.length > 0 ? car.images[0] : null
  const carName = car.name || car.title || 'Untitled Car'
  const carSubtitle = car.year && car.make && car.model
    ? `${car.year} • ${car.make} ${car.model}`
    : null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative h-48 w-full bg-gray-200 group">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={carName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FavoriteButton carId={car.id} />
        </div>
        {car.category && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            {car.category}
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{carName}</h3>
        {carSubtitle && (
          <p className="text-sm text-muted-foreground mb-2">
            {carSubtitle}
          </p>
        )}
        {(car.reg_city || car.location) && (
          <p className="text-xs text-muted-foreground mb-2">
            📍 {car.reg_city || car.location}
          </p>
        )}
        <p className="text-2xl font-bold text-primary mt-auto">
          {formatPrice(car.price)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/cars/${car.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

