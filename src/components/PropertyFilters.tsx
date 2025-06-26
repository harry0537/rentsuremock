'use client';

import { useState } from 'react';

interface PropertyFiltersProps {
  onFilterChange: (key: string, value: string | number | boolean | string[]) => void;
}

export default function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                onChange={(e) => onFilterChange('minPrice', e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Min Price</option>
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="1500">$1,500</option>
                <option value="2000">$2,000</option>
              </select>
              <select
                onChange={(e) => onFilterChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Max Price</option>
                <option value="1000">$1,000</option>
                <option value="2000">$2,000</option>
                <option value="3000">$3,000</option>
                <option value="4000">$4,000</option>
              </select>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <select
              onChange={(e) => onFilterChange('bedrooms', e.target.value ? Number(e.target.value) : '')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              onChange={(e) => onFilterChange('propertyType', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter city or neighborhood"
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities
            </label>
            <div className="space-y-2">
              {['parking', 'pool', 'gym', 'washer', 'dryer'].map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => {
                      const currentAmenities = document.querySelectorAll('input[type="checkbox"]:checked');
                      const amenities = Array.from(currentAmenities).map((input) => (input as HTMLInputElement).value);
                      onFilterChange('amenities', amenities);
                    }}
                    value={amenity}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 