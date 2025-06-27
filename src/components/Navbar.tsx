'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaUser, FaBell } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import MobileMenu from './MobileMenu'
import Button from './ui/Button'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">RentSure</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8">
            <Link
              href="/listings"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Browse Properties
            </Link>
            
            {user && user.role === 'landlord' && (
              <>
                <Link
                  href="/dashboard/landlord"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/properties"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  My Properties
                </Link>
              </>
            )}
            
            {user && (
              <>
                <Link
                  href="/favorites"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Favorites
                </Link>
                {user.role !== 'landlord' && (
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Messages
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Link 
                  href="/notifications" 
                  className="text-gray-600 hover:text-gray-900 p-2 rounded-md relative"
                  title="Notifications"
                >
                  <FaBell className="w-5 h-5" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Link>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Profile"
                  >
                    <FaUser className="w-4 h-4" />
                  </Link>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  )
} 