'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Hook to require authentication for a page
 * Redirects to login if user is not authenticated
 * 
 * @param redirectTo - Path to redirect to after login (defaults to current path)
 */
export function useRequireAuth(redirectTo?: string) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      const redirectPath = redirectTo || pathname || '/'
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [user, loading, router, pathname, redirectTo])

  return { user, loading, isAuthenticated: !!user }
}

