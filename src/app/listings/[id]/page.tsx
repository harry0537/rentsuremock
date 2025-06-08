import { FC } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import PropertyDetails from '@/components/properties/PropertyDetails';

// ✅ Fix: Correct type for dynamic route page
type PageProps = {
  params: {
    id: string;
  };
};

const ListingPage: FC<PageProps> = async ({ params }) => {
  const { id } = params;

  // Example: fetch property data
  // const res = await fetch(...);
  // const data = await res.json();

  return (
    <div>
      <h1>Listing ID: {id}</h1>
    </div>
  );
};

export default ListingPage;
