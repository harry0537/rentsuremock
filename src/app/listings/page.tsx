import { FaSearch, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRuler } from 'react-icons/fa'

// Mock data for properties
const properties = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    price: 2500,
    location: 'Downtown',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    verified: true,
  },
  {
    id: 2,
    title: 'Cozy Suburban House',
    price: 1800,
    location: 'Suburbs',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    verified: true,
  },
  // Add more mock properties as needed
]

export default function ListingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                className="input pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <button className="btn-primary flex items-center justify-center gap-2">
            <FaFilter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="card hover:shadow-lg transition-shadow">
            <div className="relative h-48 mb-4">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover rounded-lg"
              />
              {property.verified && (
                <span className="badge badge-verified absolute top-2 right-2">
                  Verified
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
            <p className="text-2xl font-bold text-primary-600 mb-4">
              ${property.price}/mo
            </p>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaBed className="w-4 h-4" />
                <span>{property.bedrooms} beds</span>
              </div>
              <div className="flex items-center gap-1">
                <FaBath className="w-4 h-4" />
                <span>{property.bathrooms} baths</span>
              </div>
              <div className="flex items-center gap-1">
                <FaRuler className="w-4 h-4" />
                <span>{property.area} sqft</span>
              </div>
            </div>
            <button className="btn-primary w-full">View Details</button>
          </div>
        ))}
      </div>
    </div>
  )
} 