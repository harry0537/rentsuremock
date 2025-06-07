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
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PropertyPage({ params }: Props) {
  try {
    const { db } = await connectToDatabase();
    const propertyId = params.id;

    if (!ObjectId.isValid(propertyId)) {
      notFound();
    }

    const property = await db
      .collection('properties')
      .findOne({ _id: new ObjectId(propertyId) });

    if (!property) {
      notFound();
    }

    return <PropertyDetails property={property} />;
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
} 