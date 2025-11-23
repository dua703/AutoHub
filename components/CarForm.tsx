'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UploadButton } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClientSupabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

interface CarFormProps {
  carId?: string
  initialData?: {
    name: string
    price: string
    description: string
    images: string[]
  }
}

export default function CarForm({ carId, initialData }: CarFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientSupabase()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        description: initialData.description,
      })
      setImages(initialData.images)
    }
  }, [initialData])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Strict authentication check
    if (!user || !user.id) {
      alert('You must be logged in to post a car ad.')
      router.push('/login')
      return
    }

    if (images.length === 0) {
      alert('Please upload at least one image')
      return
    }

    if (images.length > 5) {
      alert('Maximum 5 images allowed. Please remove some images.')
      return
    }

    setLoading(true)

    try {
      const carData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        images: images.slice(0, 5), // Ensure max 5 images
        user_id: user.id,
      }

      if (carId) {
        // Update existing car with authentication check
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', carId)
          .eq('user_id', user.id)

        if (error) {
          // Check for authentication errors
          if (error.code === 'PGRST301' || error.message.includes('permission') || error.message.includes('policy')) {
            alert('Authentication failed. You can only update your own listings.')
            router.push('/login')
            return
          }
          throw error
        }
        router.push('/dashboard')
      } else {
        // Create new car with authentication check
        const { data, error } = await supabase
          .from('cars')
          .insert([carData])
          .select()
          .single()

        if (error) {
          // Check for authentication errors
          if (error.code === 'PGRST301' || error.message.includes('permission') || error.message.includes('policy')) {
            alert('Authentication failed. Please log in again.')
            router.push('/login')
            return
          }
          throw error
        }

        // Verify the car was created with correct user_id
        if (data && data.user_id !== user.id) {
          throw new Error('Authentication verification failed')
        }
        router.push('/dashboard')
      }

      router.refresh()
    } catch (error: any) {
      console.error('Error submitting car:', error)
      alert(error.message || 'Error submitting car. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Car Name *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., 2020 Toyota Camry"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (USD) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          required
          value={formData.price}
          onChange={handleInputChange}
          placeholder="25000"
          min="0"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe the condition, features, mileage, etc."
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label>Images * (Max 5)</Label>
        <div className="w-full max-w-full overflow-hidden">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                const urls = res.map((file) => file.url)
                const newImages = [...images, ...urls]
                // Limit to 5 images max
                if (newImages.length > 5) {
                  alert('Maximum 5 images allowed. Only the first 5 will be saved.')
                  setImages(newImages.slice(0, 5))
                } else {
                  setImages(newImages)
                }
              }
            }}
            onUploadError={(error: Error) => {
              alert(`Upload failed: ${error.message}`)
            }}
            className="w-full ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-allowed-content:text-muted-foreground"
          />
        </div>
        {images.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              {images.length} / 5 image(s) uploaded
            </p>
            <div className="w-full overflow-x-auto">
              <div className="flex gap-2 min-w-max sm:grid sm:grid-cols-2 md:grid-cols-4 sm:min-w-0">
                {images.map((url, index) => (
                  <div key={index} className="relative group flex-shrink-0 w-20 h-20 sm:w-full sm:h-auto">
                    <div className="relative h-20 sm:h-24 rounded-md overflow-hidden border">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Remove image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || images.length === 0}
        className="w-full"
      >
        {loading
          ? carId
            ? 'Updating...'
            : 'Submitting...'
          : carId
          ? 'Update Car'
          : 'Post Car'}
      </Button>
    </form>
  )
}

export function CarFormWithAuth(props: CarFormProps) {
  return (
    <ProtectedRoute>
      <CarForm {...props} />
    </ProtectedRoute>
  )
}
