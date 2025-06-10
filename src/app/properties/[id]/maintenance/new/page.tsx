'use client';

import { Metadata } from 'next';
import { useParams } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import MaintenanceRequestForm from '@/components/MaintenanceRequestForm';

export const metadata: Metadata = {
  title: 'New Maintenance Request | Rentsure',
  description: 'Submit a new maintenance request for your property.',
};

export default function NewMaintenanceRequestPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <MaintenanceRequestForm
      propertyId={id}
      onSuccess={() => {}}
    />
  );
} 