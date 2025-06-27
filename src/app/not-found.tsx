import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import MobileSearchBar from '@/components/MobileSearchBar';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function NotFound() {
  const popularSearches = [
    { label: '2 bedroom apartments', href: '/listings?bedrooms=2&type=apartment' },
    { label: 'Pet-friendly rentals', href: '/listings?pets=allowed' },
    { label: 'Furnished properties', href: '/listings?furnished=true' },
    { label: 'Student housing', href: '/listings?category=student' },
    { label: 'Properties under $2000', href: '/listings?maxPrice=2000' },
    { label: 'Downtown locations', href: '/listings?location=downtown' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <HomeIcon className="w-16 h-16 text-blue-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            The property or page you're looking for seems to have moved or doesn't exist. 
            But don't worry – we have plenty of amazing rentals waiting for you!
          </p>

          {/* Search Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Search for Properties
            </h3>
            
            {/* Desktop Search */}
            <div className="hidden md:block mb-6">
              <div className="relative max-w-md mx-auto">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties, neighborhoods..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value;
                      window.location.href = `/listings?q=${encodeURIComponent(query)}`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mb-6">
              <MobileSearchBar placeholder="Search for properties..." />
            </div>

            {/* Popular Searches */}
            <div>
              <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((search, index) => (
                  <motion.div
                    key={search.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Link
                      href={search.href}
                      className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {search.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/listings"
              size="lg"
              className="flex items-center justify-center"
            >
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Browse All Properties
            </Button>
            
            <Button
              href="/"
              variant="outline"
              size="lg"
              className="flex items-center justify-center"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go to Homepage
            </Button>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Still having trouble?
          </h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you find the perfect rental property.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              href="/contact"
              variant="outline"
              size="sm"
              className="flex items-center justify-center"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-bounce-gentle" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-50 animate-bounce-gentle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-indigo-200 rounded-full opacity-50 animate-bounce-gentle" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
} 