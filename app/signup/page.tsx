'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

// Helper function to validate phone number
const validatePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '')
  // Pakistani phone number formats: 03XX-XXXXXXX (11 digits starting with 0) or +92-3XX-XXXXXXX (12 digits with country code)
  if (digits.startsWith('0')) {
    return digits.length === 11 && digits[1] === '3'
  } else if (digits.startsWith('92')) {
    return digits.length === 12 && digits[2] === '3'
  } else if (digits.startsWith('3')) {
    return digits.length === 10
  }
  return false
}

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClientSupabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const input = formData.emailOrPhone.trim()

    if (!input) {
      setError('Please enter your email or phone number')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      if (isEmail(input)) {
        // Sign up with email
        const { error } = await supabase.auth.signUp({
          email: input,
          password: formData.password,
        })

        if (error) throw error

        // Create or update user profile with email
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('user_profiles')
            .upsert({
              id: user.id,
              email: input,
            }, { onConflict: 'id' })
        }
      } else {
        // Sign up with phone - validate phone first
        if (!validatePhone(input)) {
          setError('Please enter a valid phone number (e.g., 03001234567 or +923001234567)')
          setLoading(false)
          return
        }

        const normalizedPhone = normalizePhone(input)
        
        // For phone signup, we need to use a temporary email or phone-based auth
        // Since Supabase requires email for signUp, we'll create a temporary email
        // and store the phone in user_profiles
        const tempEmail = `phone_${normalizedPhone.replace(/\D/g, '')}@autohub.local`
        
        const { error, data } = await supabase.auth.signUp({
          email: tempEmail,
          password: formData.password,
          options: {
            data: {
              phone: normalizedPhone,
            }
          }
        })

        if (error) throw error

        // Create or update user profile with phone
        if (data.user) {
          await supabase
            .from('user_profiles')
            .upsert({
              id: data.user.id,
              phone: normalizedPhone,
              email: tempEmail, // Store temp email for reference
            }, { onConflict: 'id' })
        }
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Sign up to start listing your cars
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
                  placeholder="you@example.com or 03001234567"
                />
                <p className="text-xs text-muted-foreground">
                  You can sign up using your email address or phone number
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
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}









