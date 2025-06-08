import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  return {
    title: `Listing ${params.id} | Rentsure`,
    description: 'View detailed information about this property.',
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <div className="p-4">Listing ID: {id}</div>;
}
