import type { Metadata } from 'next'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardContent from './DashboardContent'

export const metadata: Metadata = {
  title: 'My Dashboard - AutoHub',
  description: 'Manage your car listings on AutoHub. View, edit, and delete your posted cars.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
