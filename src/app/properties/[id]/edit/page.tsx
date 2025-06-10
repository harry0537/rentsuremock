import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import PropertyForm from '@/components/PropertyForm';
import { Property } from '@/types/property';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Property ${id} | Rentsure`,
    description: 'Edit property details.',
  };
}

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Transform MongoDB document to Property type
    const propertyData: Partial<Property> = {
      ...property,
      _id: property._id.toString(),
      createdAt: property.createdAt ? new Date(property.createdAt) : new Date(),
      updatedAt: property.updatedAt ? new Date(property.updatedAt) : new Date(),
    };

    return <PropertyForm initialData={propertyData} onSubmit={async (data) => {
      // TODO: Implement property update
      console.log('Updating property:', data);
    }} />;
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
}
