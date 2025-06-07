'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProperty } from '@/context/PropertyContext';
import PropertyForm from '@/components/PropertyForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Property } from '@/types/property';

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { properties, updateProperty } = useProperty();
  const [property, setProperty] = useState<Property | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const property = properties.find(p => p.id === params.id);
    if (property) {
      setProperty(property);
    }
    setIsLoading(false);
  }, [properties, params.id]);

  const handleSubmit = async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      await updateProperty(params.id, data);
      router.push(`/properties/${params.id}`);
    } catch (error) {
      console.error('Error updating property:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Property not found</h2>
          <p className="mt-2 text-gray-600">The property you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => router.push('/properties')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="landlord">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Property</h1>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <PropertyForm
                initialData={property}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 