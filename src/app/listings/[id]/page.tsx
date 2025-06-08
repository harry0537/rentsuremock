import { Metadata } from 'next';

type Props = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Listing ${params.id} | Rentsure`,
    description: 'View detailed information about this property.',
  };
}

export default function Page({ params }: Props) {
  return <div>Listing ID: {params.id}</div>;
}
