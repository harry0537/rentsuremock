'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProperty } from '@/context/PropertyContext';
import PropertyForm from '@/components/PropertyForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Property } from '@/types/property';

export default function NewPropertyPage() {
  const router = useRouter();
  const { createProperty } = useProperty();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      await createProperty(data);
      router.push('/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="landlord">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Property</h1>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 