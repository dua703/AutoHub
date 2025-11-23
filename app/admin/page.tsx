'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { createClientSupabase } from '@/lib/supabase/client'
import { Car, UserProfile, ContactMessage } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { Trash2, Eye, Mail, Users, Car as CarIcon, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  )
}

function AdminContent() {
  const { user } = useAuth()
  const supabase = createClientSupabase()
  const toast = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cars, setCars] = useState<Car[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalMessages: 0,
  })

  useEffect(() => {
    checkAdmin()
  }, [user])

  const checkAdmin = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data?.is_admin) {
        setIsAdmin(true)
        fetchData()
      } else {
        setIsAdmin(false)
        toast.error('Access denied. Admin only.')
      }
    } catch (error) {
      console.error('Error checking admin:', error)
      toast.error('Failed to verify admin access')
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      // Fetch all cars (excluding soft-deleted)
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .is('deleted_at', null) // Filter out soft-deleted cars
        .order('created_at', { ascending: false })
        .limit(50)

      if (carsError) throw carsError

      // Fetch recent messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (messagesError) throw messagesError

      // Get stats
      const { count: carsCount } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })

      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: messagesCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })

      setCars(carsData || [])
      setMessages(messagesData || [])
      setStats({
        totalCars: carsCount || 0,
        totalUsers: usersCount || 0,
        totalMessages: messagesCount || 0,
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    }
  }

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return

    // Optimistically remove from UI immediately
    const previousCars = [...cars]
    setCars((prev) => prev.filter((car) => car.id !== carId))

    try {
      // Soft delete: set deleted_at timestamp instead of hard delete
      const { error } = await supabase
        .from('cars')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', carId)

      if (error) {
        // Restore on error
        setCars(previousCars)
        throw error
      }

      toast.success('Car deleted successfully')
      // Refresh data to ensure consistency
      fetchData()
    } catch (error: any) {
      console.error('Error deleting car:', error)
      toast.error(error.message || 'Failed to delete car')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Loading admin panel...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage cars, users, and messages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cars</p>
                <p className="text-3xl font-bold">{stats.totalCars}</p>
              </div>
              <CarIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-3xl font-bold">{stats.totalMessages}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-muted-foreground">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{message.name}</p>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    <p className="mt-2">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Link href={`/car/${message.car_id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Car
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Cars */}
      <Card>
        <CardHeader>
          <CardTitle>All Cars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Owner</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="border-b">
                    <td className="p-2">
                      <Link
                        href={`/car/${car.id}`}
                        className="text-primary hover:underline"
                      >
                        {car.name}
                      </Link>
                    </td>
                    <td className="p-2">{formatPrice(car.price)}</td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {car.user_id.substring(0, 8)}...
                    </td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {new Date(car.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Link href={`/car/${car.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCar(car.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




