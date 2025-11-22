'use client'

/**
 * CarGallery Component
 * 
 * Responsive image gallery for car listings.
 * Mobile-friendly with swipeable thumbnails.
 */

import Image from 'next/image'
import { useState } from 'react'

interface CarGalleryProps {
  images: string[]
  title: string
}

export default function CarGallery({ images, title }: CarGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-sm sm:text-base text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={images[selectedImage]}
          alt={`${title} - Image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority={selectedImage === 0}
        />
      </div>
      
      {/* Thumbnail Grid - Responsive */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2 sm:gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-16 sm:h-20 md:h-24 rounded-md overflow-hidden border-2 transition-all touch-manipulation ${
                selectedImage === index
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-transparent hover:border-gray-300 active:border-gray-400'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
