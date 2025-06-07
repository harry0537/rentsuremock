'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMaintenance } from '@/context/MaintenanceContext';
import MaintenanceRequestForm from '@/components/MaintenanceRequestForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { MaintenanceRequest } from '@/types/maintenance';
import { useAuth } from '@/context/AuthContext';

export default function NewMaintenanceRequestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { createRequest } = useMaintenance();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      await createRequest({
        ...data,
        tenantId: user?.id || '',
        status: 'pending',
      });
      router.push(`/properties/${params.id}`);
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Maintenance Request</h1>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <MaintenanceRequestForm
                propertyId={params.id}
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