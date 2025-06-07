import Link from 'next/link'
import { FaHome, FaUser, FaBell } from 'react-icons/fa'

export default function Navbar() {
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
            <Link href="/listings/new" className="text-gray-600 hover:text-primary-600">
              List Property
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-primary-600">
              <FaUser className="w-5 h-5" />
            </Link>
            <Link href="/notifications" className="text-gray-600 hover:text-primary-600">
              <FaBell className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 