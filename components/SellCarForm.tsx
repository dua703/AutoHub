'use client'

/**
 * SellCarForm Component
 * 
 * Comprehensive car listing form with all required fields.
 * Fully responsive: stacks on mobile, 2 columns on tablet, maintains layout on desktop.
 * Auto-generates title as "Year Make Model".
 * Includes validation, error handling, and image upload.
 * Saves to Supabase and redirects to car detail page.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadButton } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientSupabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

// Pakistani car makes
const CAR_MAKES = [
  'Toyota', 'Honda', 'Suzuki', 'Daihatsu', 'Nissan', 'Mitsubishi',
  'Hyundai', 'Kia', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen',
  'Ford', 'Chevrolet', 'Mazda', 'Subaru', 'Lexus', 'Porsche',
  'Land Rover', 'Jeep', 'Other'
]

// Pakistani cities for registration
const REGISTRATION_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana',
  'Sheikhupura', 'Rahim Yar Khan', 'Jhang', 'Gujrat', 'Kasur',
  'Other'
]

// Engine capacities
const ENGINE_CAPACITIES = [
  '660cc', '800cc', '1000cc', '1200cc', '1300cc', '1500cc',
  '1600cc', '1800cc', '2000cc', '2200cc', '2400cc', '2500cc',
  '3000cc', '3500cc', '4000cc', '4500cc', '5000cc', 'Other'
]

// Body types
const BODY_TYPES = [
  'Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible',
  'Wagon', 'Van', 'Pickup', 'Truck', 'Other'
]

// Colors
const COLORS = [
  'White', 'Black', 'Silver', 'Gray', 'Blue', 'Red', 'Green',
  'Brown', 'Beige', 'Gold', 'Orange', 'Yellow', 'Purple', 'Other'
]

interface SellCarFormProps {}

export default function SellCarForm({}: SellCarFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientSupabase()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    transmission: '',
    engine_capacity: '',
    fuel_type: '',
    color: '',
    condition: '',
    registration_city: '',
    engine_type: '',
    body_type: '',
    assembly: '',
    price: '',
    description: '',
  })

  /**
   * Handle input changes and clear errors
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  /**
   * Validate all form fields
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.make.trim()) newErrors.make = 'Make is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.year || parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year'
    }
    if (!formData.mileage || parseInt(formData.mileage) < 0) {
      newErrors.mileage = 'Please enter a valid mileage'
    }
    if (!formData.transmission) newErrors.transmission = 'Transmission is required'
    if (!formData.engine_capacity) newErrors.engine_capacity = 'Engine capacity is required'
    if (!formData.fuel_type) newErrors.fuel_type = 'Fuel type is required'
    if (!formData.color) newErrors.color = 'Color is required'
    if (!formData.condition) newErrors.condition = 'Condition is required'
    if (!formData.registration_city) newErrors.registration_city = 'Registration city is required'
    if (!formData.engine_type.trim()) newErrors.engine_type = 'Engine type is required'
    if (!formData.body_type) newErrors.body_type = 'Body type is required'
    if (!formData.assembly) newErrors.assembly = 'Assembly is required'
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    if (images.length === 0) newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push('/login')
      return
    }

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setLoading(true)

    try {
      // Auto-generate title as "Year Make Model"
      const title = `${formData.year} ${formData.make} ${formData.model}`.trim()

      // Prepare car data for Supabase
      const carData = {
        title: title,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        transmission: formData.transmission,
        engine_capacity: formData.engine_capacity,
        fuel_type: formData.fuel_type,
        color: formData.color,
        condition: formData.condition,
        registration_city: formData.registration_city,
        engine_type: formData.engine_type,
        body_type: formData.body_type,
        assembly: formData.assembly,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        images: images,
        user_id: user.id,
        // Also set name for backward compatibility
        name: title,
      }

      // Insert car into Supabase
      const { data, error } = await supabase
        .from('cars')
        .insert([carData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Failed to save car listing')
      }

      if (!data) {
        throw new Error('No data returned from server')
      }

      // Redirect to the new car listing page
      router.push(`/cars/${data.id}`)
      router.refresh()
    } catch (error: any) {
      console.error('Error submitting car:', error)
      alert(error.message || 'Error submitting car. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Remove image from preview
   */
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    // Clear image error if images remain
    if (images.length > 1 && errors.images) {
      setErrors({
        ...errors,
        images: '',
      })
    }
  }

  /**
   * Get available models based on selected make
   */
  const getModels = (make: string): string[] => {
    if (!make) return []
    
    const commonModels: Record<string, string[]> = {
      'Toyota': ['Corolla', 'Camry', 'Prius', 'Land Cruiser', 'Hilux', 'Fortuner', 'Vitz', 'Passo', 'Aqua', 'Yaris'],
      'Honda': ['Civic', 'Accord', 'City', 'CR-V', 'Pilot', 'Fit', 'HR-V'],
      'Suzuki': ['Mehran', 'Cultus', 'Alto', 'Swift', 'Wagon R', 'Jimny', 'Vitara', 'Bolan', 'Liana'],
      'Daihatsu': ['Mira', 'Cuore', 'Move', 'Terios', 'Charade'],
      'Nissan': ['Sunny', 'Sentra', 'Altima', 'X-Trail', 'Patrol', 'March', 'Note'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'i10', 'i20'],
      'Kia': ['Sportage', 'Sorento', 'Picanto', 'Rio', 'Cerato', 'Optima'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC', 'A-Class'],
      'BMW': ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X1', 'X7'],
      'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7', 'A5', 'Q3'],
      'Other': []
    }
    
    return commonModels[make] || []
  }

  const availableModels = getModels(formData.make)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Basic Information Section */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make" className="text-sm sm:text-base">Make *</Label>
              <Select
                id="make"
                name="make"
                required
                value={formData.make}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.make ? 'border-destructive' : ''}`}
              >
                <option value="">Select Make</option>
                {CAR_MAKES.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </Select>
              {errors.make && (
                <p className="text-xs sm:text-sm text-destructive">{errors.make}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm sm:text-base">Model *</Label>
              <Select
                id="model"
                name="model"
                required
                value={formData.model}
                onChange={handleInputChange}
                disabled={!formData.make}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.model ? 'border-destructive' : ''}`}
              >
                <option value="">Select Model</option>
                {availableModels.length > 0 ? (
                  availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))
                ) : (
                  <option value="">Please select make first</option>
                )}
              </Select>
              {errors.model && (
                <p className="text-xs sm:text-sm text-destructive">{errors.model}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm sm:text-base">Year *</Label>
              <Input
                id="year"
                name="year"
                type="number"
                required
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear() + 1}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.year ? 'border-destructive' : ''}`}
              />
              {errors.year && (
                <p className="text-xs sm:text-sm text-destructive">{errors.year}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_city" className="text-sm sm:text-base">Registration City *</Label>
              <Select
                id="registration_city"
                name="registration_city"
                required
                value={formData.registration_city}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.registration_city ? 'border-destructive' : ''}`}
              >
                <option value="">Select City</option>
                {REGISTRATION_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
              {errors.registration_city && (
                <p className="text-xs sm:text-sm text-destructive">{errors.registration_city}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Specifications Section */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Vehicle Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-sm sm:text-base">Mileage (km) *</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                required
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="50000"
                min="0"
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.mileage ? 'border-destructive' : ''}`}
              />
              {errors.mileage && (
                <p className="text-xs sm:text-sm text-destructive">{errors.mileage}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission" className="text-sm sm:text-base">Transmission *</Label>
              <Select
                id="transmission"
                name="transmission"
                required
                value={formData.transmission}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.transmission ? 'border-destructive' : ''}`}
              >
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </Select>
              {errors.transmission && (
                <p className="text-xs sm:text-sm text-destructive">{errors.transmission}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="engine_capacity" className="text-sm sm:text-base">Engine Capacity *</Label>
              <Select
                id="engine_capacity"
                name="engine_capacity"
                required
                value={formData.engine_capacity}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.engine_capacity ? 'border-destructive' : ''}`}
              >
                <option value="">Select Capacity</option>
                {ENGINE_CAPACITIES.map((capacity) => (
                  <option key={capacity} value={capacity}>
                    {capacity}
                  </option>
                ))}
              </Select>
              {errors.engine_capacity && (
                <p className="text-xs sm:text-sm text-destructive">{errors.engine_capacity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_type" className="text-sm sm:text-base">Fuel Type *</Label>
              <Select
                id="fuel_type"
                name="fuel_type"
                required
                value={formData.fuel_type}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.fuel_type ? 'border-destructive' : ''}`}
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Select>
              {errors.fuel_type && (
                <p className="text-xs sm:text-sm text-destructive">{errors.fuel_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="engine_type" className="text-sm sm:text-base">Engine Type *</Label>
              <Input
                id="engine_type"
                name="engine_type"
                type="text"
                required
                value={formData.engine_type}
                onChange={handleInputChange}
                placeholder="e.g., 4-Cylinder, V6, V8"
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.engine_type ? 'border-destructive' : ''}`}
              />
              {errors.engine_type && (
                <p className="text-xs sm:text-sm text-destructive">{errors.engine_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_type" className="text-sm sm:text-base">Body Type *</Label>
              <Select
                id="body_type"
                name="body_type"
                required
                value={formData.body_type}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.body_type ? 'border-destructive' : ''}`}
              >
                <option value="">Select Body Type</option>
                {BODY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              {errors.body_type && (
                <p className="text-xs sm:text-sm text-destructive">{errors.body_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assembly" className="text-sm sm:text-base">Assembly *</Label>
              <Select
                id="assembly"
                name="assembly"
                required
                value={formData.assembly}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.assembly ? 'border-destructive' : ''}`}
              >
                <option value="">Select Assembly</option>
                <option value="Local">Local</option>
                <option value="Imported">Imported</option>
              </Select>
              {errors.assembly && (
                <p className="text-xs sm:text-sm text-destructive">{errors.assembly}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition" className="text-sm sm:text-base">Condition *</Label>
              <Select
                id="condition"
                name="condition"
                required
                value={formData.condition}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.condition ? 'border-destructive' : ''}`}
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </Select>
              {errors.condition && (
                <p className="text-xs sm:text-sm text-destructive">{errors.condition}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm sm:text-base">Color *</Label>
              <Select
                id="color"
                name="color"
                required
                value={formData.color}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.color ? 'border-destructive' : ''}`}
              >
                <option value="">Select Color</option>
                {COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </Select>
              {errors.color && (
                <p className="text-xs sm:text-sm text-destructive">{errors.color}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm sm:text-base">Price (PKR) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              required
              value={formData.price}
              onChange={handleInputChange}
              placeholder="2500000"
              min="0"
              step="1000"
              className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.price ? 'border-destructive' : ''}`}
            />
            {errors.price && (
              <p className="text-xs sm:text-sm text-destructive">{errors.price}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description Section */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Description</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm sm:text-base">Description *</Label>
            <Textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the condition, history, reason for selling, and any additional details..."
              rows={6}
              className={`w-full text-sm sm:text-base min-h-[120px] ${errors.description ? 'border-destructive' : ''}`}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 20 characters required
            </p>
            {errors.description && (
              <p className="text-xs sm:text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images Section */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Upload Images (up to 10) *</Label>
            <div className="w-full">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const urls = res.map((file) => file.url)
                    setImages((prev) => {
                      const newImages = [...prev, ...urls]
                      return newImages.slice(0, 10) // Limit to 10 images
                    })
                    // Clear image error if images are uploaded
                    if (errors.images) {
                      setErrors({
                        ...errors,
                        images: '',
                      })
                    }
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload failed: ${error.message}`)
                }}
              />
            </div>
            {errors.images && (
              <p className="text-xs sm:text-sm text-destructive">{errors.images}</p>
            )}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  {images.length} image(s) uploaded (max 10)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-24 sm:h-32 rounded-md overflow-hidden border">
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1.5 sm:p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
                        aria-label="Remove image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 sm:h-4 sm:w-4"
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold touch-manipulation"
        size="lg"
      >
        {loading ? 'Submitting...' : 'Post Ad'}
      </Button>
    </form>
  )
}

/**
 * Wrapper component with authentication protection
 */
export function SellCarFormWithAuth(props: SellCarFormProps) {
  return (
    <ProtectedRoute>
      <SellCarForm {...props} />
    </ProtectedRoute>
  )
}
