'use client'

import { SellCarFormWithAuth } from '@/components/SellCarForm'
import { useRequireAuth } from '@/hooks/useRequireAuth'

export default function SellCarPage() {
  const { loading: authLoading } = useRequireAuth()

  if (authLoading) {
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
        <h1 className="text-4xl font-bold mb-2">Post an Ad</h1>
        <p className="text-muted-foreground">
          List your car and reach thousands of potential buyers
        </p>
      </div>

      <div className="bg-white rounded-lg border p-8 max-w-4xl mx-auto">
        <SellCarFormWithAuth />
      </div>
    </div>
  )
}

