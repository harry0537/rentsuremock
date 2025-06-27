'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  verified: boolean;
  status: string;
  landlord: {
    name: string;
    verified: boolean;
    rating: number;
    reviews: number;
  };
  amenities: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    parking: boolean;
    petsAllowed: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Listing ${id} | Rentsure`,
    description: 'View detailed information about this property.',
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }
      const data = await response.json();
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              {error || 'Property not found'}
            </h3>
            <p className="text-red-700 mb-4">
              {error || 'The property you are looking for does not exist or has been removed.'}
            </p>
            <Link
              href="/listings"
              className="bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 inline-block"
            >
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/listings"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to listings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="mb-6">
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative h-96 rounded-lg overflow-hidden">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {property.images.slice(1).map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${property.title} - Image ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No images available</span>
                </div>
              )}
            </div>

            {/* Property details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 flex items-center">
                    📍 {property.location}
                  </p>
                </div>
                {property.verified && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-600">sqft</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.features && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Parking: {property.features.parking ? 'Available' : 'Not available'}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Pets: {property.features.petsAllowed ? 'Allowed' : 'Not allowed'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${property.price.toLocaleString()}/mo
                </div>
                <div className="text-sm text-gray-600">Monthly rent</div>
              </div>

              {property.landlord && (
                <div className="border-t pt-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Landlord</h3>
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">
                        {property.landlord.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{property.landlord.name}</div>
                      <div className="text-sm text-gray-600">
                        ⭐ {property.landlord.rating} ({property.landlord.reviews} reviews)
                      </div>
                    </div>
                  </div>
                  {property.landlord.verified && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Verified Landlord
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium">
                  Contact Landlord
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 font-medium">
                  Schedule Tour
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 font-medium">
                  Save Property
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-4 text-center">
                Property ID: {property._id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 