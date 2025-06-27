'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MobileSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export default function MobileSearchBar({ 
  onSearch, 
  placeholder = "Search properties...",
  showFilters = true 
}: MobileSearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const router = useRouter();

  const quickFilters = [
    { label: 'Near Campus', value: 'campus' },
    { label: 'Pet Friendly', value: 'pets' },
    { label: 'Furnished', value: 'furnished' },
    { label: 'Studio', value: 'studio' },
    { label: '2+ Bedrooms', value: '2bed' },
    { label: 'Under $2000', value: 'budget' }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      // Navigate to listings with search query
      router.push(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickFilter = (filterValue: string) => {
    router.push(`/listings?filter=${filterValue}`);
    setShowQuickFilters(false);
    setIsExpanded(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* Compact Search Button */}
      {!isExpanded && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsExpanded(true)}
          className="flex items-center w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-gray-500 md:hidden"
        >
          <MagnifyingGlassIcon className="h-5 w-5 mr-3" />
          <span>{placeholder}</span>
          {showFilters && (
            <AdjustmentsHorizontalIcon className="h-5 w-5 ml-auto text-gray-400" />
          )}
        </motion.button>
      )}

      {/* Expanded Search Interface */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="ml-3 p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Search Actions */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Search
                  </button>
                  {showFilters && (
                    <button
                      onClick={() => setShowQuickFilters(!showQuickFilters)}
                      className={`
                        px-4 py-3 border border-gray-300 rounded-lg font-medium transition-colors
                        ${showQuickFilters 
                          ? 'bg-blue-50 text-blue-600 border-blue-300' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Filters */}
              <AnimatePresence>
                {showQuickFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-gray-200"
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Filters</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {quickFilters.map((filter) => (
                          <button
                            key={filter.value}
                            onClick={() => handleQuickFilter(filter.value)}
                            className="p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors text-left"
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recent Searches */}
              <div className="flex-1 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Searches</h3>
                <div className="space-y-2">
                  {[
                    '2 bedroom apartment downtown',
                    'Pet-friendly housing near university',
                    'Studio apartment under $1500'
                  ].map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(search);
                        onSearch?.(search);
                      }}
                      className="flex items-center w-full p-3 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm">{search}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear/Reset */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowQuickFilters(false);
                  }}
                  className="w-full py-3 text-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 