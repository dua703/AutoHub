import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/ui/toast'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AutoHub - Buy & Sell Cars',
  description: 'Your trusted marketplace for buying and selling cars',
  keywords: ['cars', 'automotive', 'marketplace', 'buy cars', 'sell cars'],
  authors: [{ name: 'AutoHub' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo-flaming-car.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo-flaming-car.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'AutoHub - Buy & Sell Cars',
    description: 'Your trusted marketplace for buying and selling cars',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

