'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaUser, FaBell } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            RentSure
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

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600">
                  <FaUser className="w-5 h-5" />
                </Link>
                <Link href="/notifications" className="text-gray-600 hover:text-primary-600">
                  <FaBell className="w-5 h-5" />
                </Link>
              </>
            ) : (
              <Link href="/auth/login" className="text-gray-600 hover:text-primary-600">
                <FaUser className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/listings"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
              >
                Browse Properties
              </Link>
              
              {user && user.role === 'landlord' && (
                <>
                  <Link
                    href="/dashboard/landlord"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/properties"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                  >
                    My Properties
                  </Link>
                </>
              )}
              
              {user && (
                <>
                  <Link
                    href="/favorites"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                  >
                    Favorites
                  </Link>
                  {user.role !== 'landlord' && (
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/messages"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                  >
                    Messages
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 