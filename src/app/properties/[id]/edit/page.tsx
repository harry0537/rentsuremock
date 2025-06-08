import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import PropertyForm from '@/components/PropertyForm';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  return {
    title: `Edit Property ${params.id} | Rentsure`,
    description: 'Edit property details.',
  };
}

export default async function Page(
  { params }: { params: { id: string } }
) {
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
