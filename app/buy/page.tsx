'use client'

import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import CarCard from '@/components/CarCard'
import CarFilters, { FilterState } from '@/components/CarFilters'
import { createClientSupabase } from '@/lib/supabase/client'
import { Car } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'

type SortOption =
  | 'newest'
  | 'oldest'
  | 'price-low'
  | 'price-high'
  | 'name-asc'
  | 'name-desc'

// ---------- TYPE GUARDS ----------
const isString = (value: any): value is string =>
  typeof value === 'string' && value.trim().length > 0

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

  // ---------- FETCH CARS ----------
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

      // CATEGORY FIX (ensure string type)
      const uniqueCategories = Array.from(
        new Set((data || []).map((c) => c.category).filter(isString))
      ).sort()

      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching cars:', error)
      toast.error('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  // ---------- FILTER LOGIC ----------
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
    let result = [...cars]

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (car) =>
          car.name?.toLowerCase().includes(q) ||
          car.description?.toLowerCase().includes(q) ||
          car.category?.toLowerCase().includes(q)
      )
    }

    // Apply filters
    if (filters.make) result = result.filter((c) => c.make === filters.make)
    if (filters.minPrice)
      result = result.filter((c) => c.price >= Number(filters.minPrice))
    if (filters.maxPrice)
      result = result.filter((c) => c.price <= Number(filters.maxPrice))
    if (filters.minYear)
      result = result.filter((c) => c.year && c.year >= Number(filters.minYear))
    if (filters.maxYear)
      result = result.filter((c) => c.year && c.year <= Number(filters.maxYear))

    // Sorting logic
    result = result.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          )
        case 'oldest':
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          )
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

    setFilteredCars(result)
  }

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Loading cars...</p>
      </div>
    )
  }

  // ---------- UI ----------
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Buy a Car</h1>
        <p className="text-muted-foreground">
          Browse our selection of quality vehicles
        </p>
      </div>

      {/* Search + Sort */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
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
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <CarFilters
            onFilterChange={handleFilterChange}
            makes={Array.from(
              new Set(
                cars
                  .map((c) => c.make ?? '') // always string
                  .filter(isString) // ensures type safety
              )
            ).sort()}
          />
        </div>

        {/* Cars */}
        <div className="lg:col-span-3">
          {filteredCars.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredCars.length} car
                {filteredCars.length !== 1 ? 's' : ''}
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
                No cars match your filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilteredCars(cars)
                  setSearchQuery('')
                  setSortBy('newest')
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
