'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import CarCard from '@/components/CarCard'
import CarFilters, { FilterState } from '@/components/CarFilters'
import { createClientSupabase } from '@/lib/supabase/client'
import { Car } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'

type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc'

/**
 * Type guard to filter out undefined/null values and ensure array contains only strings
 * This properly narrows the type from (string | undefined)[] to string[]
 */
const isString = (value: string | undefined | null): value is string => {
  return typeof value === 'string' && value.length > 0
}

/**
 * Type guard to filter out undefined/null values and ensure array contains only numbers
 * This properly narrows the type from (number | undefined)[] to number[]
 */
const isNumber = (value: number | undefined | null): value is number => {
  return typeof value === 'number' && !isNaN(value)
}

export default function BuyPage() {
  const supabase = createClientSupabase()
  const toast = useToast()
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setCars(data || [])
      setFilteredCars(data || [])
      
      // Extract unique categories using type guard to ensure only strings
      const uniqueCategories = Array.from(
        new Set((data || []).map((car) => car.category).filter(isString))
      ).sort()
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching cars:', error)
      toast.error('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: FilterState) => {
    applyFiltersAndSearch(filters, searchQuery, sortBy)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    applyFiltersAndSearch({} as FilterState, query, sortBy)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
    applyFiltersAndSearch({} as FilterState, searchQuery, sort)
  }

  const applyFiltersAndSearch = (
    filters: FilterState,
    query: string,
    sort: SortOption
  ) => {
    let filtered = [...cars]

    // Search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (car) =>
          car.name?.toLowerCase().includes(lowerQuery) ||
          car.description?.toLowerCase().includes(lowerQuery) ||
          car.category?.toLowerCase().includes(lowerQuery)
      )
    }

    // Apply other filters
    if (filters.make) {
      filtered = filtered.filter((car) => car.make === filters.make)
    }

    if (filters.minPrice) {
      filtered = filtered.filter((car) => car.price >= parseFloat(filters.minPrice))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((car) => car.price <= parseFloat(filters.maxPrice))
    }

    if (filters.minYear) {
      filtered = filtered.filter((car) => car.year && car.year >= parseInt(filters.minYear))
    }

    if (filters.maxYear) {
      filtered = filtered.filter((car) => car.year && car.year <= parseInt(filters.maxYear))
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '')
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '')
        default:
          return 0
      }
    })

    setFilteredCars(sorted)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Loading cars...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Buy a Car</h1>
        <p className="text-muted-foreground">
          Browse our selection of quality vehicles
        </p>
      </div>

      {/* Search and Sort Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, description, or category..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSearchChange('')}
              className={!searchQuery ? 'bg-primary text-primary-foreground' : ''}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => handleSearchChange(category)}
                className={searchQuery === category ? 'bg-primary text-primary-foreground' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <CarFilters
            onFilterChange={handleFilterChange}
            makes={Array.from(new Set(cars.map((c) => c.make).filter(isString))).sort()}
          />
        </div>

        {/* Car Listings */}
        <div className="lg:col-span-3">
          {filteredCars.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No cars found matching your criteria.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSortBy('newest')
                setFilteredCars(cars)
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
