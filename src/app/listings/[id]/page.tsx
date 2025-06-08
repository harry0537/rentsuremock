import { Metadata } from 'next';
import type { PageProps } from 'next';

export async function generateMetadata({ params }: PageProps<{ id: string }>): Promise<Metadata> {
  return {
    title: `Listing ${params.id} | Rentsure`,
    description: 'View detailed information about this property.',
  };
}

export default async function Page({ params }: PageProps<{ id: string }>) {
  return <div className="p-4">Listing ID: {params.id}</div>;
}
