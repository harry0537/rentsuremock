import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import PropertyDetails from '@/components/properties/PropertyDetails';

// ✅ Fix: Correct type for dynamic route page
type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  // Example fetch, replace with your logic
  const res = await fetch(`https://api.example.com/properties/${id}`);
  const data = await res.json();

  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
}
