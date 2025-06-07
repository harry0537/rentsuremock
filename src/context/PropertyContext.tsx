'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Property, PropertyFilters } from '@/types/property';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  fetchProperties: () => Promise<void>;
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      if (!response.ok) throw new Error('Failed to create property');
      const newProperty = await response.json();
      setProperties(prev => [...prev, newProperty]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id: string, property: Partial<Property>) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      if (!response.ok) throw new Error('Failed to update property');
      const updatedProperty = await response.json();
      setProperties(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updatedProperty } : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete property');
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        error,
        filters,
        setFilters,
        fetchProperties,
        createProperty,
        updateProperty,
        deleteProperty,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
} 