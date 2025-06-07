'use client';

import { useEffect, useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PropertiesPage() {
  const { properties, loading, error, filters, setFilters, fetchProperties } = useProperty();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProperties = properties.filter(property => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.address.city.toLowerCase().includes(query) ||
        property.address.state.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          {user?.role === 'landlord' && (
            <Link
              href="/properties/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add New Property
            </Link>
          )}
        </div>

        <div className="mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <select
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Min Price</option>
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="1500">$1,500</option>
                <option value="2000">$2,000</option>
              </select>
              <select
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Max Price</option>
                <option value="1000">$1,000</option>
                <option value="2000">$2,000</option>
                <option value="3000">$3,000</option>
                <option value="4000">$4,000</option>
              </select>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 