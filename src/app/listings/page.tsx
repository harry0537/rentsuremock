// src/app/listings/[id]/page.tsx

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import SearchBar from '@/components/SearchBar';
import PropertyFilters from '@/components/PropertyFilters';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Button from '@/components/ui/Button';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { showToast } from '@/lib/toast';
import { 
  ViewColumnsIcon, 
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  verified: boolean;
  landlord: {
    name: string;
    verified: boolean;
    rating: number;
    reviews: number;
  };
  amenities: string[];
}

const PROPERTIES_PER_PAGE = 9;

export default function ListingsPage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    state: '',
    propertyType: '',
    amenities: [] as string[],
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setAllProperties(data);
      showToast.success('Properties loaded successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    let filtered = allProperties;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.amenities.some(amenity => amenity.toLowerCase().includes(query))
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= Number(filters.maxPrice));
    }

    // Bedroom filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= Number(filters.bedrooms));
    }

    // Bathroom filter
    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= Number(filters.bathrooms));
    }

    // Location filters
    if (filters.city) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.state) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.every(amenity =>
          property.amenities.some(propAmenity => 
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }

    return filtered;
  }, [allProperties, searchQuery, filters]);

  // Pagination
  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice(0, currentPage * PROPERTIES_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const hasNextPage = paginatedProperties.length < filteredProperties.length;

  // Infinite scroll
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    loading: loadingMore,
    onLoadMore: () => {
      setLoadingMore(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
      }, 500);
    },
  });

  const handleFilterChange = (key: string, value: string | number | boolean | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset pagination when filters change
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      state: '',
      propertyType: '',
      amenities: [],
    });
    setSearchQuery('');
    setCurrentPage(1);
    showToast.success('Filters cleared');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset pagination when search changes
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <SkeletonLoader className="h-16 w-full max-w-4xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader key={index} variant="card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error loading listings</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchProperties} variant="danger">
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Search Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <SearchBar
            onSearch={handleSearch}
            onFilterToggle={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
            className="mb-4"
          />
          
          {/* Mobile filter toggle */}
          <div className="md:hidden">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:w-80 flex-shrink-0"
              >
                <PropertyFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  onClearFilters={clearFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Listings</h1>
                <p className="text-gray-600">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1 mt-4 sm:mt-0">
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewType === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewType === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ViewColumnsIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== '')) && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-900">Active Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    return (
                      <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {key}: {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Properties Grid/List */}
            {paginatedProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or clearing the filters.
                  </p>
                  <Button onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <motion.div 
                  className={viewType === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                    : 'space-y-6'
                  }
                  layout
                >
                  <AnimatePresence>
                    {paginatedProperties.map((property, index) => (
                      <motion.div
                        key={property._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        layout
                      >
                        <PropertyCard property={property} viewType={viewType} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Infinite Scroll Loader */}
                {hasNextPage && (
                  <div ref={loadMoreRef} className="mt-8 text-center">
                    {loadingMore && (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <SkeletonLoader key={index} variant="card" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Property Card Component
function PropertyCard({ property, viewType }: { property: Property; viewType: 'grid' | 'list' }) {
  if (viewType === 'list') {
    return (
      <Link
        href={`/listings/${property._id}`}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex"
      >
        <div className="relative w-80 h-48 flex-shrink-0">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {property.verified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Verified
            </div>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <span>{property.bedrooms} bed</span>
              <span className="mx-2">•</span>
              <span>{property.bathrooms} bath</span>
              <span className="mx-2">•</span>
              <span>{property.area} sqft</span>
            </div>
            <div className="text-sm text-gray-600 mb-3">📍 {property.location}</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              ${property.price.toLocaleString()}/mo
            </span>
            {property.landlord && (
              <div className="flex items-center">
                <span className="text-xs text-gray-500">
                  ⭐ {property.landlord.rating} ({property.landlord.reviews})
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/listings/${property._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        {property.images && property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {property.verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Verified
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${property.price.toLocaleString()}/mo
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span>{property.bedrooms} bed</span>
          <span className="mx-2">•</span>
          <span>{property.bathrooms} bath</span>
          <span className="mx-2">•</span>
          <span>{property.area} sqft</span>
        </div>
        <div className="text-sm text-gray-600 mb-3">📍 {property.location}</div>
        
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {property.landlord && (
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{property.landlord.name}</div>
              <div className="text-xs text-gray-600">
                ⭐ {property.landlord.rating} ({property.landlord.reviews} reviews)
              </div>
            </div>
            {property.landlord.verified && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Verified
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
