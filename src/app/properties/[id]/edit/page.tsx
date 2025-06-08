import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import PropertyForm from '@/components/properties/PropertyForm';

export const metadata: Metadata = {
  title: 'Edit Property | Rentsure',
  description: 'Edit your property listing details.',
};

export default async function Page({ params }) {
  const { id } = params;

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

    return <PropertyForm property={property} />;
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
}
