import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import PropertyDetails from '@/components/properties/PropertyDetails';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Property Details | Rentsure',
    description: 'View detailed information about this property.',
  };
}

export default async function Page({ params }: Props) {
  const { id } = params;

  // Validate and fetch property data
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

    return <PropertyDetails property={property} />;
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
}
