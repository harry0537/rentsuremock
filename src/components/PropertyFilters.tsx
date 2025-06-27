'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  XMarkIcon, 
  HomeIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

interface PropertyFiltersProps {
  onFilterChange: (key: string, value: string | number | boolean | string[]) => void;
  filters?: Record<string, any>;
  onClearFilters?: () => void;
}

export default function PropertyFilters({ 
  onFilterChange, 
  filters = {},
  onClearFilters 
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
    bedrooms: filters.bedrooms || '',
    bathrooms: filters.bathrooms || '',
    city: filters.city || '',
    state: filters.state || '',
    propertyType: filters.propertyType || '',
    amenities: filters.amenities || [],
    ...filters
  });

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    onFilterChange(key, value);
  };

  const clearFilters = () => {
    const emptyFilters = {
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      state: '',
      propertyType: '',
      amenities: [],
    };
    setLocalFilters(emptyFilters);
    Object.keys(emptyFilters).forEach(key => {
      onFilterChange(key, emptyFilters[key as keyof typeof emptyFilters]);
    });
    onClearFilters?.();
  };

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'studio', label: 'Studio' },
  ];

  const amenityOptions = [
    'parking', 'gym', 'pool', 'laundry', 'garden', 'fireplace', 
    'garage', 'balcony', 'dishwasher', 'air conditioning'
  ];

  const hasActiveFilters = Object.values(localFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-blue-500" />
          Filters
        </h3>
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
            Price Range
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Min price"
              value={localFilters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || '')}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max price"
              value={localFilters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || '')}
              className="text-sm"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            Property Type
          </h4>
          <select
            value={localFilters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Bedrooms</h4>
            <select
              value={localFilters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', Number(e.target.value) || '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Bathrooms</h4>
            <select
              value={localFilters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', Number(e.target.value) || '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="1.5">1.5+</option>
              <option value="2">2+</option>
              <option value="2.5">2.5+</option>
              <option value="3">3+</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            Location
          </h4>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="City"
              value={localFilters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="text-sm"
            />
            <Input
              type="text"
              placeholder="State"
              value={localFilters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            {amenityOptions.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localFilters.amenities.includes(amenity)}
                  onChange={(e) => {
                    const newAmenities = e.target.checked
                      ? [...localFilters.amenities, amenity]
                      : localFilters.amenities.filter((a: string) => a !== amenity);
                    handleFilterChange('amenities', newAmenities);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {amenity.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={localFilters.amenities.includes('parking') ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                const newAmenities = localFilters.amenities.includes('parking')
                  ? localFilters.amenities.filter((a: string) => a !== 'parking')
                  : [...localFilters.amenities, 'parking'];
                handleFilterChange('amenities', newAmenities);
              }}
            >
              Parking
            </Button>
            <Button
              variant={localFilters.amenities.includes('pool') ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                const newAmenities = localFilters.amenities.includes('pool')
                  ? localFilters.amenities.filter((a: string) => a !== 'pool')
                  : [...localFilters.amenities, 'pool'];
                handleFilterChange('amenities', newAmenities);
              }}
            >
              Pool
            </Button>
            <Button
              variant={localFilters.amenities.includes('gym') ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                const newAmenities = localFilters.amenities.includes('gym')
                  ? localFilters.amenities.filter((a: string) => a !== 'gym')
                  : [...localFilters.amenities, 'gym'];
                handleFilterChange('amenities', newAmenities);
              }}
            >
              Gym
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 