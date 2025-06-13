'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { useProperties } from '@/context/PropertyContext';
import { Property } from '@/types/property';

interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  amenities?: string[];
  location?: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { getAllProperties } = useProperties();
  const router = useRouter();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const data = await getAllProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error loading properties:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [getAllProperties]);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev: PropertyFilters) => ({ ...prev, [key]: value }));
  };

  const filteredProperties = properties.filter(property => {
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;
    if (filters.propertyType && property.type !== filters.propertyType) return false;
    if (filters.location && !property.address.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.amenities && filters.amenities.length > 0) {
      return filters.amenities.every(amenity => property.amenities.includes(amenity));
    }
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