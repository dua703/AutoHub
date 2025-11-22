/**
 * Footer Component
 * 
 * Professional footer with copyright and developer credit.
 * Fully responsive with proper spacing and alignment.
 * Includes quick navigation links.
 */

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col items-center space-y-4 sm:space-y-5">
          {/* Main Copyright */}
          <p className="text-center text-xs sm:text-sm font-medium text-foreground">
            © {currentYear} AutoHub. All rights reserved.
          </p>
          
          {/* Developer Credit */}
          <p className="text-center text-xs text-muted-foreground/80 leading-relaxed px-4">
            Design & Developed by{' '}
            <a
              href="mailto:duaariz04@gmail.com"
              className="hover:text-primary transition-colors underline-offset-2 hover:underline break-all sm:break-normal"
            >
              duaariz04@gmail.com
            </a>
          </p>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2 text-xs text-muted-foreground">
            <Link href="/buy" className="hover:text-primary transition-colors touch-manipulation">
              Browse Cars
            </Link>
            <Link href="/sell" className="hover:text-primary transition-colors touch-manipulation">
              Sell Your Car
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors touch-manipulation">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
