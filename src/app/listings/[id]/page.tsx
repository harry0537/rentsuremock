import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import PropertyDetails from '@/components/properties/PropertyDetails';

export const metadata: Metadata = {
  title: 'Property Details | Rentsure',
  description: 'View detailed information about this property listing.',
};

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      notFound();
    }

    const property = await db
      .collection('properties')
      .findOne({ _id: new ObjectId(id) });

    if (!property) {
      notFound();
    }

    return <PropertyDetails property={property} />;
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
} 