'use client';

import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { useProperty } from '@/context/PropertyContext';
import { useEffect } from 'react';

export default function PropertiesPage() {
  const { properties, loading, error, filters, setFilters, fetchProperties } = useProperty();
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (key: string, value: string | number | boolean | string[]) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredProperties = properties.filter(property => {
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false;
    if (filters.city && !property.location.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.state && !property.location.toLowerCase().includes(filters.state.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <PropertyFilters onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property._id}
                property={property}
                onClick={() => router.push(`/properties/${property._id}`)}
              />
            ))}
          </div>
          {filteredProperties.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No properties found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 