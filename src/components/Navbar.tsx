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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/listings" className="text-gray-600 hover:text-primary-600">
              Browse Rentals
            </Link>
            {user && (
              <Link href="/favorites" className="text-gray-600 hover:text-primary-600">
                Favorites
              </Link>
            )}
            {user?.role === 'landlord' && (
              <Link href="/listings/new" className="text-gray-600 hover:text-primary-600">
                List Property
              </Link>
            )}
            <Link href="/about" className="text-gray-600 hover:text-primary-600">
              About
            </Link>
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
        </div>
      </div>
    </nav>
  )
} 