import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={property.images[0] || '/images/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            property.status === 'available'
              ? 'bg-green-100 text-green-800'
              : property.status === 'rented'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/properties/${property.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            {property.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500">
          {property.address.street}, {property.address.city}, {property.address.state}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="ml-1">{property.features.bedrooms} beds</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="ml-1">{property.features.bathrooms} baths</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="ml-1">{property.features.squareFeet} sqft</span>
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            ${property.price.toLocaleString()}/mo
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {property.features.parking && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Parking
              </span>
            )}
            {property.features.petsAllowed && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Pets Allowed
              </span>
            )}
          </div>
          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 