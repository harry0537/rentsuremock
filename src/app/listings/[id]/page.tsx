import { FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaStar, FaUser } from 'react-icons/fa'

// Mock data for a single property
const property = {
  id: 1,
  title: 'Modern Downtown Apartment',
  description: 'Beautiful modern apartment in the heart of downtown. Recently renovated with high-end finishes and appliances. Walking distance to restaurants, shops, and public transportation.',
  price: 2500,
  location: 'Downtown',
  bedrooms: 2,
  bathrooms: 2,
  area: 1200,
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
  ],
  verified: true,
  landlord: {
    name: 'John Smith',
    verified: true,
    rating: 4.8,
    reviews: 24,
  },
  amenities: [
    'Parking',
    'Gym',
    'Pool',
    'Security',
    'Air Conditioning',
    'Washer/Dryer',
  ],
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Carousel */}
      <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.verified && (
          <span className="badge badge-verified absolute top-4 right-4">
            Verified Property
          </span>
        )}
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <p className="text-2xl font-bold text-primary-600 mb-6">
            ${property.price}/mo
          </p>
          
          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="w-5 h-5" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBed className="w-5 h-5" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBath className="w-5 h-5" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <FaRuler className="w-5 h-5" />
              <span>{property.area} sqft</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p>{property.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <FaStar className="w-4 h-4 text-primary-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Landlord Info and Action Buttons */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Landlord Information</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FaUser className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{property.landlord.name}</span>
                  {property.landlord.verified && (
                    <span className="badge badge-verified">Verified</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  <span>{property.landlord.rating}</span>
                  <span className="text-gray-400">
                    ({property.landlord.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            <button className="btn-primary w-full mb-3">Contact Landlord</button>
            <button className="btn-secondary w-full">Express Interest</button>
          </div>
        </div>
      </div>
    </div>
  )
} 