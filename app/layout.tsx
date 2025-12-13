import type { Metadata } from 'next'
import Script from 'next/script'
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
      { url: '/autohub-logo.jpeg', sizes: 'any', type: 'image/jpeg' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/autohub-logo.jpeg', type: 'image/jpeg' },
    ],
    shortcut: [
      { url: '/autohub-logo.jpeg', type: 'image/jpeg' },
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
        {/* Google tag (gtag.js) - beforeInteractive injects into head */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HQCMTLY3R6"
          strategy="beforeInteractive"
        />
        <Script
          id="google-analytics"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HQCMTLY3R6');
            `,
          }}
        />
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
