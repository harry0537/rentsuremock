'use client';

import { useParams } from 'next/navigation';
import MaintenanceRequestForm from '@/components/MaintenanceRequestForm';

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