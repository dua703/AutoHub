'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { createClientSupabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/toast'
import { Review } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface ReviewSectionProps {
  carId: string
}

export default function ReviewSection({ carId }: ReviewSectionProps) {
  const { user } = useAuth()
  const supabase = createClientSupabase()
  const toast = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [hasError, setHasError] = useState(false)
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const errorShownRef = useRef(false)
  const submittingRef = useRef(false) // Prevent duplicate submissions

  // Debounced fetchReviews with silent error handling
  const fetchReviews = useCallback(async (showError = false) => {
    // Clear any pending fetch
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
    }

    // Debounce: wait 300ms before fetching
    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        
        if (!supabase) {
          console.error('Database connection not available')
          setReviews([])
          setLoading(false)
          if (showError && !errorShownRef.current) {
            errorShownRef.current = true
            toast.error('Database connection not available')
          }
          return
        }

        const { data, error } = await supabase
          .from('reviews')
          .select('*, user_profile:user_profiles(full_name, email)')
          .eq('car_id', carId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching reviews:', error)
          setReviews([])
          setHasError(true)
          // Only show error if explicitly requested and not already shown
          if (showError && !errorShownRef.current) {
            errorShownRef.current = true
            toast.error('Failed to load reviews. Please try again later.')
          }
          return
        }

        // Success - reset error state
        setHasError(false)
        errorShownRef.current = false
        setReviews(data || [])
        
        if (user) {
          const myReview = data?.find((r) => r.user_id === user.id)
          setUserReview(myReview || null)
          if (myReview) {
            setRating(myReview.rating)
            setComment(myReview.comment || myReview.review_text || '')
          } else {
            setRating(0)
            setComment('')
          }
        }
      } catch (error: any) {
        console.error('Error fetching reviews:', error)
        setHasError(true)
        setReviews([])
        // Only show error if explicitly requested and not already shown
        if (showError && !errorShownRef.current) {
          errorShownRef.current = true
          const errorMessage = error?.message || 'Failed to load reviews'
          if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            toast.error('Network error. Please check your connection and try again.')
          } else if (errorMessage.includes('permission') || errorMessage.includes('policy')) {
            toast.error('Unable to load reviews. Please refresh the page.')
          } else {
            toast.error('Failed to load reviews. Please try again later.')
          }
        }
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [carId, supabase, user, toast])

  useEffect(() => {
    // Initial load - silent (no error toast)
    fetchReviews(false)
    
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
  }, [carId]) // Only depend on carId, not fetchReviews

  // Separate effect for user changes
  useEffect(() => {
    if (user && reviews.length > 0) {
      const myReview = reviews.find((r) => r.user_id === user.id)
      setUserReview(myReview || null)
      if (myReview) {
        setRating(myReview.rating)
        setComment(myReview.comment || myReview.review_text || '')
      }
    } else if (!user) {
      setUserReview(null)
      setRating(0)
      setComment('')
    }
  }, [user, reviews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent duplicate submissions
    if (submittingRef.current) {
      return
    }

    if (!user || !user.id) {
      toast.warning('Please sign in to leave a review')
      return
    }

    if (rating === 0) {
      toast.warning('Please select a rating')
      return
    }

    submittingRef.current = true
    setSubmitting(true)

    try {
      if (userReview) {
        // Update existing review
        const { data, error } = await supabase
          .from('reviews')
          .update({ 
            rating, 
            comment: comment.trim() || null,
            review_text: comment.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userReview.id)
          .eq('user_id', user.id)
          .select('*, user_profile:user_profiles(full_name, email)')
          .single()

        if (error) {
          console.error('Error updating review:', error)
          throw error
        }
        
        // Instantly update the review in the list
        if (data) {
          setReviews((prev) => 
            prev.map((r) => r.id === data.id ? data : r)
          )
          setUserReview(data)
        }
        
        toast.success('✅ Review updated successfully!')
        errorShownRef.current = false
      } else {
        // Create new review
        const { data, error } = await supabase
          .from('reviews')
          .insert([{ 
            car_id: carId, 
            user_id: user.id, 
            rating, 
            comment: comment.trim() || null,
            review_text: comment.trim() || null
          }])
          .select('*, user_profile:user_profiles(full_name, email)')
          .single()

        if (error) {
          console.error('Error creating review:', error)
          throw error
        }
        
        // Instantly append the new review to the list
        if (data) {
          setReviews((prev) => [data, ...prev])
          setUserReview(data)
        }
        
        toast.success('✅ Review submitted successfully!')
        
        // Clear form fields
        setRating(0)
        setComment('')
        errorShownRef.current = false
      }
    } catch (error: any) {
      console.error('Error submitting review:', error)
      const errorMessage = error?.message || 'Failed to submit review'
      
      // Show clear error toast
      toast.error('❌ Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
      submittingRef.current = false
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Review deleted')
      setUserReview(null)
      setRating(0)
      setComment('')
      errorShownRef.current = false
      fetchReviews(false)
    } catch (error: any) {
      console.error('Error deleting review:', error)
      const errorMessage = error?.message || 'Failed to delete review'
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.')
      } else {
        toast.error('Failed to delete review. Please try again.')
      }
    }
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Reviews</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn('h-5 w-5', {
                  'fill-yellow-400 text-yellow-400': star <= Math.round(averageRating),
                  'text-gray-300': star > Math.round(averageRating),
                })}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      {user && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Your Rating *</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      disabled={submitting}
                      className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Star
                        className={cn('h-6 w-6 transition-colors', {
                          'fill-yellow-400 text-yellow-400': star <= rating,
                          'text-gray-300 hover:text-yellow-400': star > rating && !submitting,
                        })}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-2">
                {userReview && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDelete(userReview.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={submitting || submittingRef.current} 
                  className="flex-1"
                >
                  {submitting ? (userReview ? 'Updating...' : 'Submitting...') : (userReview ? 'Update Review' : 'Submit Review')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">
            {hasError ? 'Unable to load reviews.' : 'No reviews yet. Be the first to review!'}
          </p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">
                      {review.user_profile?.full_name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn('h-4 w-4', {
                            'fill-yellow-400 text-yellow-400': star <= review.rating,
                            'text-gray-300': star > review.rating,
                          })}
                        />
                      ))}
                    </div>
                  </div>
                  {user?.id === review.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {(review.comment || review.review_text) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {review.comment || review.review_text}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}






