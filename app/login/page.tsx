'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Helper function to detect if input is email or phone
const isEmail = (input: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}

// Helper function to normalize phone number
const normalizePhone = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  // If it starts with 0, replace with country code (Pakistan: +92)
  if (digits.startsWith('0')) {
    return '+92' + digits.substring(1)
  }
  // If it doesn't start with +, add +92
  if (!digits.startsWith('92')) {
    return '+92' + digits
  }
  return '+' + digits
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientSupabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const input = formData.emailOrPhone.trim()
      
      if (!input) {
        setError('Please enter your email or phone number')
        setLoading(false)
        return
      }

      let authResult

      if (isEmail(input)) {
        // Login with email
        authResult = await supabase.auth.signInWithPassword({
          email: input,
          password: formData.password,
        })
      } else {
        // Login with phone - normalize phone number first
        const normalizedPhone = normalizePhone(input)
        
        // For phone login, we need to use signInWithOtp or check if user exists
        // Since Supabase doesn't support password auth with phone directly,
        // we'll try to find the user by phone in user_profiles and get their email
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('phone', normalizedPhone)
          .single()

        if (profileError || !profileData?.email) {
          // Try alternative phone formats
          const altFormats = [
            input.replace(/\D/g, ''), // Just digits
            input.startsWith('0') ? '+92' + input.substring(1).replace(/\D/g, '') : null,
            input.replace(/\D/g, '').startsWith('92') ? '+' + input.replace(/\D/g, '') : null,
          ].filter(Boolean)

          let foundEmail = null
          for (const format of altFormats) {
            const { data } = await supabase
              .from('user_profiles')
              .select('email')
              .eq('phone', format)
              .single()
            
            if (data?.email) {
              foundEmail = data.email
              break
            }
          }

          if (!foundEmail) {
            setError('No account found with this phone number. Please use email or sign up.')
            setLoading(false)
            return
          }

          authResult = await supabase.auth.signInWithPassword({
            email: foundEmail,
            password: formData.password,
          })
        } else {
          authResult = await supabase.auth.signInWithPassword({
            email: profileData.email,
            password: formData.password,
          })
        }
      }

      if (authResult.error) throw authResult.error

      // Redirect to the specified page or dashboard
      const redirectTo = searchParams?.get('redirect') || '/dashboard'
      router.push(redirectTo)
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
                <Input
                  id="emailOrPhone"
                  type="text"
                  required
                  value={formData.emailOrPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emailOrPhone: e.target.value })
                  }
                  placeholder="you@example.com or +923001234567"
                />
                <p className="text-xs text-muted-foreground">
                  You can sign in using your email address or phone number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





