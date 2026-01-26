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

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UploadButton } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { createClientSupabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { numberToWords } from '@/lib/utils'

// Pakistani car makes
const CAR_MAKES = [
  'Toyota', 'Honda', 'Suzuki', 'Daihatsu', 'Nissan', 'Mitsubishi',
  'Hyundai', 'Kia', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen',
  'Ford', 'Chevrolet', 'Mazda', 'Subaru', 'Lexus', 'Porsche',
  'Land Rover', 'Jeep', 'Other'
]

// Pakistani bike makes
const BIKE_MAKES = [
  'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'Benelli',
  'Harley Davidson', 'Ducati', 'KTM', 'High Speed', 'United',
  'Qingqi', 'Superstar', 'Road Prince', 'Unique', 'Super Asia',
  'Other'
]

// Pakistani cities for registration
const REGISTRATION_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana',
  'Sheikhupura', 'Rahim Yar Khan', 'Jhang', 'Gujrat', 'Kasur',
  'Other'
]

// Engine capacities (for cars and bikes)
const ENGINE_CAPACITIES = [
  '70cc', '100cc', '125cc', '150cc', '200cc', '250cc', '300cc', '350cc', '400cc', '500cc', '650cc',
  '660cc', '800cc', '1000cc', '1200cc', '1300cc', '1500cc',
  '1600cc', '1800cc', '2000cc', '2200cc', '2400cc', '2500cc',
  '3000cc', '3500cc', '4000cc', '4500cc', '5000cc', 'Other'
]

// Standard engine types
const ENGINE_TYPES = [
  'Inline-3', 'Inline-4', 'Inline-5', 'Inline-6',
  'V4', 'V6', 'V8', 'V10', 'V12',
  'Flat-2 (Boxer)',
  'Flat-4 (Boxer)', 'Flat-6 (Boxer)',
  'W8', 'W12',
  'Rotary (Wankel)',
  'Single Cylinder', 'Twin Cylinder', 'Triple Cylinder',
  'Other'
]

// Body types (for cars)
const CAR_BODY_TYPES = [
  'Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible',
  'Wagon', 'Van', 'Pickup', 'Truck', 'Other'
]

// Bike types
const BIKE_TYPES = [
  'Standard', 'Sports', 'Cruiser', 'Touring', 'Adventure', 'Naked',
  'Scooter', 'Moped', 'Electric', 'Other'
]

// Common vehicle features (PakWheels-style)
const ALL_FEATURES = [
  'ABS', 'Airbags', 'Power Steering', 'Power Windows', 'Power Mirrors',
  'Central Locking', 'Keyless Entry', 'Sunroof', 'Leather Seats',
  'Alloy Wheels', 'Fog Lights', 'Rear Camera', 'Parking Sensors',
  'Cruise Control', 'Climate Control', 'Touchscreen Display',
  'Bluetooth', 'USB Port', 'Navigation System', 'Sound System',
  'Third Row Seating', 'Roof Rails', 'Running Boards', 'Spoiler',
  'LED Headlights', 'DRL (Daytime Running Light)', 'Auto Headlights',
  'Rain Sensing Wipers', 'Auto Dimming Mirror', 'Memory Seats',
  'Heated Seats', 'Cooled Seats', 'Ventilated Seats', 'TPMS (Tire Pressure Monitoring System)', 'Wireless Charging', '360 Camera'
]

// Features auto-selected based on model (PakWheels-style)
const MODEL_FEATURES: Record<string, string[]> = {
  'Mehran': ['Power Steering', 'Power Windows', 'Central Locking'],
  'Cultus': ['Power Steering', 'Power Windows', 'Central Locking', 'Airbags'],
  'Alto': ['Power Steering', 'Power Windows', 'Central Locking'],
  'Swift': ['Power Steering', 'Power Windows', 'Central Locking', 'Airbags', 'ABS'],
  'Corolla': ['Power Steering', 'Power Windows', 'Central Locking', 'Airbags', 'ABS', 'Alloy Wheels'],
  'Civic': ['Power Steering', 'Power Windows', 'Central Locking', 'Airbags', 'ABS', 'Alloy Wheels', 'Sunroof'],
  'City': ['Power Steering', 'Power Windows', 'Central Locking', 'Airbags', 'ABS'],
  // Add more as needed
}

// Engine type mapping by make + model (fallbacks by vehicle type)
const ENGINE_TYPE_BY_MODEL: Record<string, Record<string, string>> = {
  'Honda': {
    'CBR600RR': 'Inline-4',
    'CBR1000RR': 'Inline-4',
    'CBR250R': 'Single Cylinder',
    'CBR150R': 'Single Cylinder',
  },
  'Kawasaki': {
    'Ninja ZX-6R': 'Inline-4',
    'Ninja ZX-10R': 'Inline-4',
    'Ninja ZX14': 'Inline-4',
  },
  'BMW': {
    'S 1000 RR': 'Inline-4',
    'R 1250 GS': 'Flat-2 (Boxer)',
  },
  'Porsche': {
    '911': 'Flat-6 (Boxer)',
  },
  'Land Rover': {
    'Defender': 'Inline-6',
  },
}

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
    vehicle_type: 'Car',
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
    location: '',
    engine_type: '',
    body_type: '',
    assembly: '',
    price: '',
    description: '',
    phone: '',
    seller_name: '',
    whatsapp_enabled: false,
  })
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  /**
   * Handle input changes and clear errors
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }

      if (name === 'model') {
        const autoEngineType = value
          ? getEngineTypeForSelection(prev.vehicle_type, prev.make, value)
          : ''
        next.engine_type = autoEngineType
      }

      if (name === 'vehicle_type' || name === 'make') {
        next.model = ''
        next.engine_type = ''
      }

      return next
    })

    // Auto-select features when model changes
    if (name === 'model') {
      const autoFeatures = value ? MODEL_FEATURES[value] || [] : []
      setSelectedFeatures(autoFeatures)
    }
    if (name === 'vehicle_type' || name === 'make') {
      setSelectedFeatures([])
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }
  
  /**
   * Handle feature checkbox toggle
   */
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  /**
   * Resolve engine type based on vehicle type, make, and model
   */
  const getEngineTypeForSelection = (vehicleType: string, make: string, model: string): string => {
    if (!make || !model) return ''
    const makeMap = ENGINE_TYPE_BY_MODEL[make]
    if (makeMap && makeMap[model]) return makeMap[model]
    // Fallbacks by vehicle type
    return vehicleType === 'Bike' ? 'Single Cylinder' : 'Inline-4'
  }

  /**
   * Validate phone number format
   */
  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const digits = phone.replace(/\D/g, '')
    
    // Pakistani phone number formats:
    // - 03XX-XXXXXXX (11 digits starting with 0)
    // - +92-3XX-XXXXXXX (12 digits with country code)
    // - 92-3XX-XXXXXXX (11 digits without +)
    // - 3XX-XXXXXXX (10 digits without country code)
    
    if (digits.length < 10 || digits.length > 12) {
      return false
    }
    
    // Should start with 0, 3, or 92
    if (digits.startsWith('0')) {
      return digits.length === 11 && digits[1] === '3'
    } else if (digits.startsWith('92')) {
      return digits.length === 12 && digits[2] === '3'
    } else if (digits.startsWith('3')) {
      return digits.length === 10
    }
    
    return false
  }

  /**
   * Normalize phone number for storage
   */
  const normalizePhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '')
    
    // Convert to standard format: +92-3XX-XXXXXXX
    if (digits.startsWith('0')) {
      return '+92' + digits.substring(1)
    } else if (digits.startsWith('92')) {
      return '+' + digits
    } else if (digits.startsWith('3')) {
      return '+92' + digits
    }
    
    return phone // Return as-is if format is unexpected
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
    if (!formData.location?.trim()) newErrors.location = 'Location is required'
    if (!formData.engine_type) newErrors.engine_type = 'Engine type is required'
    if (!formData.body_type) newErrors.body_type = 'Body type is required'
    if (!formData.seller_name?.trim()) newErrors.seller_name = 'Seller name is required'
    if (!formData.assembly) newErrors.assembly = 'Assembly is required'
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., 03001234567 or +923001234567)'
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

    // Strict authentication check
    if (!user || !user.id) {
      alert('You must be logged in to post a car ad.')
      router.push('/login')
      return
    }

    // Validate image count
    if (images.length > 10) {
      alert('Maximum 10 images allowed. Please remove some images.')
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

      // Prepare vehicle data for Supabase
      const vehicleData = {
        title: title,
        vehicle_type: formData.vehicle_type,
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
        location: formData.location.trim(),
        engine_type: formData.engine_type,
        body_type: formData.body_type,
        assembly: formData.assembly,
        price: parseFloat(formData.price),
        price_currency: 'PKR', // Always default to PKR
        description: formData.description.trim(),
        phone: normalizePhone(formData.phone), // Normalize and store phone number
        seller_name: formData.seller_name.trim(),
        whatsapp_enabled: formData.whatsapp_enabled,
        features: selectedFeatures, // Array of selected features
        images: images.slice(0, 10), // Limit to 10 images
        user_id: user.id,
        // Also set name for backward compatibility
        name: title,
      }

      // Insert vehicle into Supabase with authentication check
      const { data, error } = await supabase
        .from('cars')
        .insert([vehicleData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        // Check for authentication errors
        if (error.code === 'PGRST301' || error.message.includes('permission') || error.message.includes('policy')) {
          alert('Authentication failed. Please log in again.')
          router.push('/login')
          return
        }
        throw new Error(error.message || 'Failed to save car listing')
      }

      if (!data) {
        throw new Error('No data returned from server')
      }

      // Verify the car was created with correct user_id
      if (data.user_id !== user.id) {
        throw new Error('Authentication verification failed')
      }

      // Redirect to the new car listing page
      router.push(`/car/${data.id}`)
      // Revalidate homepage and buy page to show new ad
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
   * Get available models based on selected make and vehicle type
   */
  const getModels = (make: string, vehicleType: string): string[] => {
    if (!make) return []
    
    if (vehicleType === 'Bike') {
      const bikeModels: Record<string, string[]> = {
        'Honda': ['CD70', 'CD125', 'CG125', 'CG150', 'CB150F', 'CB250F', 'CBR150R', 'CBR250R', 'CBR600RR', 'CBR1000RR'],
        'Yamaha': ['YBZ125', 'YBR125', 'YBR250', 'YZF-R15', 'YZF-R3', 'YZF-R6', 'YZF-R1', 'FZ150', 'FZ250'],
        'Suzuki': ['GD110', 'GS150', 'GR150', 'GSX-R150', 'GSX-R600', 'GSX-R1000', 'Hayabusa'],
        'Kawasaki': ['Ninja 250', 'Ninja 300', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja ZX14', 'Ninja 2800', 'Ninja 2900'],
        'BMW': ['G 310 R', 'G 310 GS', 'S 1000 RR', 'R 1250 GS'],
        'Benelli': ['TNT 150', 'TNT 300', 'TNT 600i', 'TRK 502'],
        'Harley Davidson': ['Street 750', 'Iron 883', 'Sportster S', 'Fat Boy'],
        'Ducati': ['Monster', 'Panigale V2', 'Panigale V4', 'Diavel'],
        'KTM': ['Duke 200', 'Duke 250', 'Duke 390', 'RC 200', 'RC 390'],
        'High Speed': ['Infinity 150', 'Freedom 200', 'SR 200'],
        'United': ['United 70', 'United 125', 'United 150'],
        'Qingqi': ['QM70', 'QM125'],
        'Superstar': ['70', '125'],
        'Road Prince': ['70', '125'],
        'Unique': ['70', '125'],
        'Super Asia': ['70', '125', '150'],
        'Other': []
      }
      return bikeModels[make] || []
    } else {
      const carModels: Record<string, string[]> = {
        'Toyota': ['Corolla', 'Camry', 'Prius', 'Land Cruiser', 'Hilux', 'Fortuner', 'Vitz', 'Passo', 'Aqua', 'Yaris', 'Axio', 'Harrier', 'Mark X', 'Crown', 'LC200', 'LC250', 'LC300', 'Premio', 'Raize'],
        'Honda': ['Civic', 'Accord', 'City', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'N-Box'],
        'Suzuki': ['Mehran', 'Cultus', 'Alto', 'Swift', 'Wagon R', 'Jimny', 'Vitara', 'Bolan', 'Liana', 'Baleno'],
        'Daihatsu': ['Mira', 'Cuore', 'Move', 'Terios', 'Charade', 'Rocky', 'Pleo', 'Taft', 'Tanto'],
        'Nissan': ['Sunny', 'Sentra', 'Altima', 'X-Trail', 'Patrol', 'March', 'Note', 'GTR'],
        'Mitsubishi': ['Lancer', 'Pajero', 'Outlander', 'Mirage'],
        'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'i10', 'i20', 'Ioniq 6', 'Santro', 'Shahroze'],
        'Kia': ['Sportage', 'Sorento', 'Picanto', 'Rio', 'Cerato', 'Optima', 'Grand Carnival'],
        'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC', 'A-Class', 'G-Class'],
        'BMW': ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X1', 'X7'],
        'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7', 'A5', 'Q3', 'e-tron', 'e-tron GT', 'R8'],
        'Volkswagen': ['Golf', 'Passat', 'Polo', 'Tiguan'],
        'Chevrolet': ['Cruze', 'Malibu', 'Tahoe', 'Camaro'],
        'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-5'],
        'Subaru': ['Impreza', 'Legacy', 'Forester', 'Outback'],
        'Lexus': ['IS', 'ES', 'RX', 'LX'],
        'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera'],
        'Land Rover': ['Range Rover', 'Range Rover Sport', 'Defender', 'Discovery'],
        'Jeep': ['Wrangler', 'Cherokee', 'Grand Cherokee', 'Compass'],
        'Other': []
      }
      return carModels[make] || []
    }
  }

  const availableModels = getModels(formData.make, formData.vehicle_type)
  const availableMakes = formData.vehicle_type === 'Bike' ? BIKE_MAKES : CAR_MAKES
  const availableBodyTypes = formData.vehicle_type === 'Bike' ? BIKE_TYPES : CAR_BODY_TYPES
  
  // Calculate price in words
  const priceInWords = formData.price && !isNaN(parseFloat(formData.price)) && parseFloat(formData.price) > 0
    ? numberToWords(parseFloat(formData.price))
    : ''

  // Calculate mileage in words
  const mileageInWords = formData.mileage && !isNaN(parseFloat(formData.mileage)) && parseFloat(formData.mileage) >= 0
    ? `${numberToWords(parseFloat(formData.mileage))} km`
    : ''

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
              <Label htmlFor="vehicle_type" className="text-sm sm:text-base">Vehicle Type *</Label>
              <Select
                id="vehicle_type"
                name="vehicle_type"
                required
                value={formData.vehicle_type}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.vehicle_type ? 'border-destructive' : ''}`}
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </Select>
              {errors.vehicle_type && (
                <p className="text-xs sm:text-sm text-destructive">{errors.vehicle_type}</p>
              )}
            </div>

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
                {availableMakes.map((make) => (
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

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm sm:text-base">Location *</Label>
              <Input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your city/area (e.g., Karachi, Gulshan-e-Iqbal)"
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.location ? 'border-destructive' : ''}`}
              />
              {errors.location && (
                <p className="text-xs sm:text-sm text-destructive">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller_name" className="text-sm sm:text-base">Your Name *</Label>
              <Input
                id="seller_name"
                name="seller_name"
                type="text"
                required
                value={formData.seller_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.seller_name ? 'border-destructive' : ''}`}
              />
              {errors.seller_name && (
                <p className="text-xs sm:text-sm text-destructive">{errors.seller_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="03001234567 or +923001234567"
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.phone ? 'border-destructive' : ''}`}
              />
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="whatsapp_enabled"
                  name="whatsapp_enabled"
                  checked={formData.whatsapp_enabled}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="whatsapp_enabled" className="text-xs text-muted-foreground cursor-pointer">
                  Enable WhatsApp contact button
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your contact number (e.g., 03001234567 or +923001234567)
              </p>
              {errors.phone && (
                <p className="text-xs sm:text-sm text-destructive">{errors.phone}</p>
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
              {mileageInWords && (
                <p className="text-sm font-semibold text-primary mt-1">
                  {mileageInWords}
                </p>
              )}
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
                <option value="Semi-Automatic">Semi-Automatic</option>
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
                <option value="CNG">CNG</option>
                <option value="LPG">LPG</option>
                <option value="PHEV">PHEV (Plug-in Hybrid)</option>
              </Select>
              {errors.fuel_type && (
                <p className="text-xs sm:text-sm text-destructive">{errors.fuel_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="engine_type" className="text-sm sm:text-base">Engine Type *</Label>
              <Select
                id="engine_type"
                name="engine_type"
                required
                value={formData.engine_type}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.engine_type ? 'border-destructive' : ''}`}
              >
                <option value="">Select Engine Type</option>
                {ENGINE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              {errors.engine_type && (
                <p className="text-xs sm:text-sm text-destructive">{errors.engine_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_type" className="text-sm sm:text-base">{formData.vehicle_type === 'Bike' ? 'Bike Type' : 'Body Type'} *</Label>
              <Select
                id="body_type"
                name="body_type"
                required
                value={formData.body_type}
                onChange={handleInputChange}
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${errors.body_type ? 'border-destructive' : ''}`}
              >
                <option value="">Select {formData.vehicle_type === 'Bike' ? 'Bike Type' : 'Body Type'}</option>
                {availableBodyTypes.map((type) => (
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
            {priceInWords && (
              <p className="text-sm font-semibold text-primary mt-1">
                {priceInWords} Rupees
              </p>
            )}
            {errors.price && (
              <p className="text-xs sm:text-sm text-destructive">{errors.price}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Panel Section */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Features</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select features available in your {formData.vehicle_type.toLowerCase()}. Features are auto-selected based on your model.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2 border rounded-md">
              {ALL_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`feature-${feature}`}
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`feature-${feature}`} className="text-xs sm:text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
            {selectedFeatures.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
              </p>
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
            <div className="w-full max-w-full overflow-hidden">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const urls = res.map((file) => file.url)
                    const newImages = [...images, ...urls]
                    // Limit to 10 images max
                    if (newImages.length > 10) {
                      alert('Maximum 10 images allowed. Only the first 10 will be saved.')
                      setImages(newImages.slice(0, 10))
                    } else {
                      setImages(newImages)
                    }
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
                className="w-full ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-allowed-content:text-muted-foreground ut-button:w-full sm:ut-button:w-auto"
              />
            </div>
            {errors.images && (
              <p className="text-xs sm:text-sm text-destructive">{errors.images}</p>
            )}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  {images.length} / 10 image(s) uploaded
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
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
