import { Metadata } from 'next';

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Listing ${params.id} | Rentsure`,
    description: 'View detailed information about this property.',
  };
}

export default async function Page({ params }: Props) {
  const { id } = params;
  return <div>Listing ID: {id}</div>;
}
