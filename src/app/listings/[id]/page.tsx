// ✅ Fix: Correct type for dynamic route page
type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  // Your fetch logic
  const res = await fetch(`https://your-api.com/listings/${id}`);
  const listing = await res.json();

  return (
    <div>
      <h1>{listing.title}</h1>
    </div>
  );
}
