import { Metadata } from 'next';

export async function generateMetadata({ params }) {
  return {
    title: `Listing ${params.id} | Rentsure`,
    description: 'View detailed information about this property.',
  };
}

export default function Page({ params }) {
  return <div className="p-4">Listing ID: {params.id}</div>;
}
