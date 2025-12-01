'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import CarCard from '@/components/CarCard'
import CarFilters, { FilterState } from '@/components/CarFilters'
import { createClientSupabase } from '@/lib/supabase/client'
import { Car } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { useRequireAuth } from '@/hooks/useRequireAuth'

type SortOption =
  | 'newest'
  | 'oldest'
  | 'price-low'
  | 'price-high'
  | 'name-asc'
  | 'name-desc'

const isString = (value: string | undefined | null): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

export default function BuyPageClient() {
  const { loading: authLoading } = useRequireAuth()
  
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

    const channel = supabase
      .channel('cars-changes')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'cars',
        },
        (payload) => {
          setCars((prev) => prev.filter((car) => car.id !== payload.old.id))
          setFilteredCars((prev) => prev.filter((car) => car.id !== payload.old.id))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cars',
        },
        (payload) => {
          if (payload.new.deleted_at) {
            setCars((prev) => prev.filter((car) => car.id !== payload.new.id))
            setFilteredCars((prev) => prev.filter((car) => car.id !== payload.new.id))
          } else if (payload.old?.deleted_at && !payload.new.deleted_at) {
            fetchCars()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCars(data || [])
      setFilteredCars(data || [])

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

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (car) =>
          car.name?.toLowerCase().includes(q) ||
          car.description?.toLowerCase().includes(q) ||
          car.category?.toLowerCase().includes(q)
      )
    }

    if (filters.make && filters.make.trim()) {
      result = result.filter((c) => c.make === filters.make)
    }
    if (filters.minPrice && filters.minPrice.trim()) {
      const minPrice = Number(filters.minPrice)
      if (!isNaN(minPrice)) {
        result = result.filter((c) => c.price >= minPrice)
      }
    }
    if (filters.maxPrice && filters.maxPrice.trim()) {
      const maxPrice = Number(filters.maxPrice)
      if (!isNaN(maxPrice)) {
        result = result.filter((c) => c.price <= maxPrice)
      }
    }
    if (filters.minYear && filters.minYear.trim()) {
      const minYear = Number(filters.minYear)
      if (!isNaN(minYear)) {
        result = result.filter((c) => c.year && c.year >= minYear)
      }
    }
    if (filters.maxYear && filters.maxYear.trim()) {
      const maxYear = Number(filters.maxYear)
      if (!isNaN(maxYear)) {
        result = result.filter((c) => c.year && c.year <= maxYear)
      }
    }

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

  const makes: string[] = useMemo(() => {
    return Array.from(new Set(cars.map((c) => c.make).filter(isString))).sort()
  }, [cars])

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Loading...</p>
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

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search cars..."
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
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <CarFilters
            onFilterChange={handleFilterChange}
            makes={makes}
          />
        </div>

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

