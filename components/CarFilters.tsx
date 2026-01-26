'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface CarFiltersProps {
  onFilterChange: (filters: FilterState) => void
  makes: string[]
}

export interface FilterState {
  vehicle_type?: string
  make: string
  model: string
  minPrice: string
  maxPrice: string
  minYear: string
  maxYear: string
}

export default function CarFilters({ onFilterChange, makes }: CarFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    vehicle_type: '',
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
  })

  const handleChange = (field: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      vehicle_type: '',
      make: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="bg-white p-6 rounded-lg border space-y-4">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="space-y-2">
        <Label htmlFor="vehicle_type">Vehicle Type</Label>
        <Select
          id="vehicle_type"
          value={filters.vehicle_type || ''}
          onChange={(e) => handleChange('vehicle_type', e.target.value)}
        >
          <option value="">All Vehicles</option>
          <option value="Car">Cars</option>
          <option value="Bike">Bikes</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="make">Make</Label>
        <Select
          id="make"
          value={filters.make}
          onChange={(e) => handleChange('make', e.target.value)}
        >
          <option value="">All Makes</option>
          {makes.filter((make): make is string => typeof make === 'string' && make.trim().length > 0).map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          placeholder="Search model"
          value={filters.model}
          onChange={(e) => handleChange('model', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="1000000"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minYear">Min Year</Label>
          <Input
            id="minYear"
            type="number"
            placeholder="1900"
            value={filters.minYear}
            onChange={(e) => handleChange('minYear', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxYear">Max Year</Label>
          <Input
            id="maxYear"
            type="number"
            placeholder={String(new Date().getFullYear())}
            value={filters.maxYear}
            onChange={(e) => handleChange('maxYear', e.target.value)}
          />
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear Filters
      </Button>
    </div>
  )
}

