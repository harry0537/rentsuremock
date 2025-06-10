import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import MaintenanceRequestForm from '@/components/MaintenanceRequestForm';

export const metadata: Metadata = {
  title: 'New Maintenance Request | Rentsure',
  description: 'Submit a new maintenance request for your property.',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(id)) {
      notFound();
    }

    const property = await db
      .collection('properties')
      .findOne({ _id: new ObjectId(id) });

    if (!property) {
      notFound();
    }

    return <MaintenanceRequestForm propertyId={id} />;
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
} 