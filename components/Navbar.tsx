'use client'

/**
 * Navbar Component
 * 
 * Fully responsive navigation bar with mobile menu.
 * Sticky header that works on all screen sizes.
 */

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            <Image
              src="/autohub-logo.jpeg"
              alt="AutoHub Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
              priority
            />
            <span>AutoHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-sm">
                Home
              </Button>
            </Link>
            <Link href="/buy">
              <Button variant="ghost" size="sm" className="text-sm">
                Buy
              </Button>
            </Link>
            <Link href="/sell">
              <Button variant="ghost" size="sm" className="text-sm">
                Sell
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm" className="text-sm">
                Contact
              </Button>
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/favorites">
                      <Button variant="ghost" size="sm" className="text-sm">
                        Favorites
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="text-sm">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm"
                      onClick={signOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="text-sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm" className="text-sm">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm h-10">
                Home
              </Button>
            </Link>
            <Link href="/buy" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm h-10">
                Buy
              </Button>
            </Link>
            <Link href="/sell" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm h-10">
                Sell
              </Button>
            </Link>
            <Link href="/contact" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm h-10">
                Contact
              </Button>
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/favorites" className="block">
                      <Button variant="ghost" className="w-full justify-start text-sm h-10">
                        Favorites
                      </Button>
                    </Link>
                    <Link href="/dashboard" className="block">
                      <Button variant="ghost" className="w-full justify-start text-sm h-10">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-10"
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full justify-start text-sm h-10">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" className="block">
                      <Button className="w-full justify-start text-sm h-10">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
