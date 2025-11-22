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
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('car_id', carId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setIsFavorite(!!data)
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast.warning('Please sign in to add favorites')
      return
    }

    setLoading(true)

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('car_id', carId)

        if (error) throw error

        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, car_id: carId }])

        if (error) throw error

        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorite')
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



