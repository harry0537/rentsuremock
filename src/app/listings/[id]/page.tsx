import { Metadata } from 'next';

export async function generateMetadata(_props: any): Promise<Metadata> {
  const { params } = _props;
  return {
    title: `Listing ${params.id} | Rentsure`,
    description: 'View detailed information about this property.',
  };
}

export default function Page(props: any) {
  const { id } = props.params;
  return <div className="p-4">Listing ID: {id}</div>;
}
