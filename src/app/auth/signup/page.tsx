import Link from 'next/link'
import { FaEnvelope, FaLock, FaUser, FaHome, FaBuilding } from 'react-icons/fa'

export default function SignupPage() {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-gray-600">
          Join RentSure as a tenant or landlord
        </p>
      </div>

      {/* Role Selection */}
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 border-2 border-primary-600 rounded-lg text-primary-600 hover:bg-primary-50">
            <FaHome className="w-5 h-5" />
            <span>Tenant</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border-2 border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            <FaBuilding className="w-5 h-5" />
            <span>Landlord</span>
          </button>
        </div>
      </div>

      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input pl-10"
                placeholder="Enter your full name"
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input pl-10"
                placeholder="Enter your email"
              />
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input pl-10"
                placeholder="Create a password"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="input pl-10"
                placeholder="Confirm your password"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </label>
        </div>

        <div>
          <button type="submit" className="btn-primary w-full">
            Create Account
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>
    </div>
  )
} 