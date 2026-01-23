'use client'

/**
 * CarDetailsClient Component
 * 
 * Client component for displaying car details.
 * Fully responsive: stacks on mobile, side-by-side on desktop.
 * Shows all specifications, images, and seller information.
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, Fuel, Settings, Palette, Shield } from 'lucide-react'
import CarGallery from '@/components/CarGallery'
import ReviewSection from '@/components/ReviewSection'
import ContactSellerModal from '@/components/ContactSellerModal'
import FavoriteButton from '@/components/FavoriteButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'

interface CarDetailsClientProps {
  car: Car
}

export default function CarDetailsClient({ car }: CarDetailsClientProps) {
  const { user } = useAuth()
  const [showContactModal, setShowContactModal] = useState(false)
  const carTitle = car.title || car.name || 'Untitled Car'

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        {/* Image Gallery */}
        <div>
          <CarGallery images={car.images} title={carTitle} />
        </div>

        {/* Car Details */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 break-words">{carTitle}</h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                {formatPrice(car.price, car.price_currency || 'PKR')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <FavoriteButton carId={car.id} />
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {(car.registration_city || car.reg_city || car.location) && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{car.registration_city || car.reg_city || car.location}</span>
              </div>
            )}
            {car.year && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{car.year}</span>
              </div>
            )}
            {(car.fuel_type || car.engine_type) && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Fuel className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{car.fuel_type || car.engine_type}</span>
              </div>
            )}
            {car.transmission && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{car.transmission}</span>
              </div>
            )}
            {car.color && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Palette className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{car.color}</span>
              </div>
            )}
            {car.condition && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="capitalize truncate">{car.condition}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{car.description}</p>
            </CardContent>
          </Card>

          {/* Specifications Table */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {car.make && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Make</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.make}</span>
                  </div>
                )}
                {car.model && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Model</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.model}</span>
                  </div>
                )}
                {car.year && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Year</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.year}</span>
                  </div>
                )}
                {car.mileage && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Mileage</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.mileage.toLocaleString()} km</span>
                  </div>
                )}
                {car.transmission && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Transmission</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.transmission}</span>
                  </div>
                )}
                {car.engine_capacity && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Engine Capacity</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.engine_capacity}</span>
                  </div>
                )}
                {car.fuel_type && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Fuel Type</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.fuel_type}</span>
                  </div>
                )}
                {car.engine_type && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Engine Type</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.engine_type}</span>
                  </div>
                )}
                {car.body_type && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Body Type</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.body_type}</span>
                  </div>
                )}
                {car.assembly && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Assembly</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.assembly}</span>
                  </div>
                )}
                {car.condition && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Condition</span>
                    <span className="text-xs sm:text-sm font-semibold text-right capitalize">{car.condition}</span>
                  </div>
                )}
                {car.color && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Color</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.color}</span>
                  </div>
                )}
                {(car.registration_city || car.reg_city) && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Registration City</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.registration_city || car.reg_city}</span>
                  </div>
                )}
                {car.location && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Location</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.location}</span>
                  </div>
                )}
                {car.vehicle_type && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Vehicle Type</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.vehicle_type}</span>
                  </div>
                )}
                {car.seller_name && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Seller Name</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.seller_name}</span>
                  </div>
                )}
                {car.phone && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-xs sm:text-sm text-muted-foreground">Contact</span>
                    <span className="text-xs sm:text-sm font-semibold text-right">{car.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          {car.features && car.features.length > 0 && (
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-green-600">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {user?.id === car.user_id ? (
              <Link href={`/car/${car.id}/edit`} className="flex-1">
                <Button size="lg" variant="outline" className="w-full h-11 sm:h-12 text-sm sm:text-base touch-manipulation">
                  Edit Listing
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  size="lg"
                  className="flex-1 h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                  onClick={() => setShowContactModal(true)}
                >
                  Contact Seller
                </Button>
                {car.whatsapp_enabled && car.phone && (
                  <a
                    href={`https://wa.me/${car.phone.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in your ${car.vehicle_type || 'vehicle'}: ${carTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base touch-manipulation bg-green-600 hover:bg-green-700 text-white border-green-600"
                    >
                      WhatsApp
                    </Button>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 sm:mt-12">
        <ReviewSection carId={car.id} />
      </div>

      {/* Contact Modal */}
      <ContactSellerModal
        car={car}
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  )
}
