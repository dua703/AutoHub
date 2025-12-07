'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClientSupabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  carId: string
  className?: string
}

export default function FavoriteButton({ carId, className }: FavoriteButtonProps) {
  const { user } = useAuth()
  const supabase = createClientSupabase()
  const toast = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      checkFavorite()
    }
  }, [user, carId])

  const checkFavorite = async () => {
    if (!user) {
      setIsFavorite(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('car_id', carId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is fine
        console.error('Error checking favorite:', error)
        setIsFavorite(false)
        return
      }

      setIsFavorite(!!data)
    } catch (error) {
      console.error('Error checking favorite:', error)
      setIsFavorite(false)
    }
  }

  const toggleFavorite = async () => {
    // Strict authentication check
    if (!user || !user.id) {
      toast.warning('Please sign in to add favorites')
      return
    }

    setLoading(true)

    try {
      if (isFavorite) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('car_id', carId)

        if (error) {
          // Check for authentication errors
          if (error.code === 'PGRST301' || error.message.includes('permission')) {
            toast.error('Authentication failed. Please log in again.')
            return
          }
          throw error
        }

        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        // Add favorite with authentication verification
        const { data, error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, car_id: carId }])
          .select()
          .single()

        if (error) {
          // Check for authentication errors
          if (error.code === 'PGRST301' || error.message.includes('permission')) {
            toast.error('Authentication failed. Please log in again.')
            return
          }
          // Handle duplicate favorite (unique constraint)
          if (error.code === '23505') {
            // Already favorited, just update state
            setIsFavorite(true)
            return
          }
          throw error
        }

        // Verify the favorite was created with correct user_id
        if (data && data.user_id !== user.id) {
          throw new Error('Authentication verification failed')
        }

        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      toast.error(error.message || 'Failed to update favorite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(className)}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={cn('h-5 w-5', {
          'fill-red-500 text-red-500': isFavorite,
        })}
      />
    </Button>
  )
}




