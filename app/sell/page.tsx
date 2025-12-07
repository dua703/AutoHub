import type { Metadata } from 'next'
import { SellCarFormWithAuth } from '@/components/SellCarForm'

export const metadata: Metadata = {
  title: 'Sell Your Car - AutoHub',
  description: 'List your car on AutoHub and reach thousands of potential buyers. Post your car listing today.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sell Your Car - AutoHub',
    description: 'List your car on AutoHub and reach thousands of potential buyers.',
    type: 'website',
  },
}

export default function SellPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Post an Ad</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          List your car and reach thousands of potential buyers
        </p>
      </div>

      <div className="bg-white rounded-lg border p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <SellCarFormWithAuth />
      </div>
    </div>
  )
}
