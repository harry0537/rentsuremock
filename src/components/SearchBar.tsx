'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  MapPinIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  onFilterToggle, 
  placeholder = "Search properties...",
  showFilters = false,
  className = ''
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // Call onSearch when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const quickFilters = [
    { label: 'Studio', icon: HomeIcon, query: 'studio' },
    { label: '1 Bedroom', icon: HomeIcon, query: '1 bedroom' },
    { label: '2 Bedroom', icon: HomeIcon, query: '2 bedroom' },
    { label: 'Pet Friendly', icon: HomeIcon, query: 'pet friendly' },
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <motion.div 
        className="bg-white rounded-lg shadow-md border border-gray-200"
        animate={{ 
          boxShadow: isExpanded 
            ? '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center p-4">
          <div className="flex-1 relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              placeholder={placeholder}
              startIcon={<MagnifyingGlassIcon />}
              endIcon={
                query && (
                  <button
                    onClick={clearSearch}
                    className="hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )
              }
              fullWidth
              className="text-base"
            />
          </div>
          
          <div className="ml-4 flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onFilterToggle}
              className={`transition-colors ${
                showFilters ? 'bg-blue-50 text-blue-600 border-blue-300' : ''
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100 px-4 pb-4 overflow-hidden"
            >
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-3">Quick filters:</p>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((filter) => (
                    <motion.button
                      key={filter.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuery(filter.query)}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <filter.icon className="h-3 w-3 mr-1" />
                      {filter.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>Search by location, property type, amenities, or keywords</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 