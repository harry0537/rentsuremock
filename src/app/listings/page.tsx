// src/app/listings/[id]/page.tsx

import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Listings | Rentsure',
  description: 'Browse available properties.',
};

export default function ListingPage(
  { params }: { params: Record<string, never> }
) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Listings</h1>
      {/* Add your listings content here */}
    </div>
  );
}
