import Link from 'next/link'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'

export default function LoginPage() {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-gray-600">
          Sign in to your RentSure account
        </p>
      </div>

      <form className="mt-8 space-y-6">
        <div className="space-y-4">
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
                autoComplete="current-password"
                required
                className="input pl-10"
                placeholder="Enter your password"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link href="/auth/forgot-password" className="text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <FaUser className="w-5 h-5" />
            <span className="ml-2">Google</span>
          </button>
          <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <FaUser className="w-5 h-5" />
            <span className="ml-2">Facebook</span>
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-primary-600 hover:text-primary-500">
          Sign up
        </Link>
      </p>
    </div>
  )
} 