import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Listing ${id} | Rentsure`,
    description: 'View detailed information about this property.',
  };
}

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <div className="p-4">Listing ID: {id}</div>;
} 