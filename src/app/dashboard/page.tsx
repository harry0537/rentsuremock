import { FaHome, FaUser, FaBell, FaEnvelope, FaStar, FaCheck } from 'react-icons/fa'
import Image from 'next/image'

// Mock data for tenant dashboard
const tenantData = {
  savedListings: [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    },
    {
      id: 2,
      title: 'Cozy Suburban House',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    },
  ],
  applications: [
    {
      id: 1,
      property: 'Modern Downtown Apartment',
      status: 'pending',
      date: '2024-02-15',
    },
    {
      id: 2,
      property: 'Cozy Suburban House',
      status: 'approved',
      date: '2024-02-10',
    },
  ],
  messages: [
    {
      id: 1,
      from: 'John Smith',
      subject: 'Application Update',
      date: '2024-02-16',
      unread: true,
    },
  ],
}

// Mock data for landlord dashboard
const landlordData = {
  listings: [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      price: 2500,
      views: 245,
      interested: 12,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    },
  ],
  applications: [
    {
      id: 1,
      applicant: 'Sarah Johnson',
      property: 'Modern Downtown Apartment',
      date: '2024-02-15',
      status: 'pending',
    },
  ],
  messages: [
    {
      id: 1,
      from: 'Sarah Johnson',
      subject: 'Question about the apartment',
      date: '2024-02-16',
      unread: true,
    },
  ],
}

export default function DashboardPage() {
  // Mock user role - in a real app, this would come from authentication
  const userRole = 'tenant'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FaUser className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">John Doe</h3>
                <span className="badge badge-verified">Verified {userRole}</span>
              </div>
            </div>

            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-2 text-primary-600">
                <FaHome className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                <FaBell className="w-5 h-5" />
                <span>Notifications</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                <FaEnvelope className="w-5 h-5" />
                <span>Messages</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                <FaStar className="w-5 h-5" />
                <span>Reviews</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {userRole === 'tenant' ? (
            <div className="space-y-8">
              {/* Saved Listings */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Saved Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tenantData.savedListings.map((listing) => (
                    <div key={listing.id} className="flex gap-4">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{listing.title}</h3>
                        <p className="text-primary-600 font-semibold">
                          ${listing.price}/mo
                        </p>
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
                <div className="space-y-4">
                  {tenantData.applications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{application.property}</h3>
                        <p className="text-sm text-gray-600">
                          Applied on {application.date}
                        </p>
                      </div>
                      <span
                        className={`badge ${
                          application.status === 'approved'
                            ? 'badge-verified'
                            : 'badge-pending'
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
                <div className="space-y-4">
                  {tenantData.messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{message.from}</h3>
                        <p className="text-sm text-gray-600">{message.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{message.date}</p>
                        {message.unread && (
                          <span className="inline-block w-2 h-2 bg-primary-600 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Listings */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {landlordData.listings.map((listing) => (
                    <div key={listing.id} className="flex gap-4">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{listing.title}</h3>
                        <p className="text-primary-600 font-semibold">
                          ${listing.price}/mo
                        </p>
                        <div className="text-sm text-gray-600">
                          <p>{listing.views} views</p>
                          <p>{listing.interested} interested</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
                <div className="space-y-4">
                  {landlordData.applications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{application.applicant}</h3>
                        <p className="text-sm text-gray-600">
                          {application.property}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`badge ${
                            application.status === 'approved'
                              ? 'badge-verified'
                              : 'badge-pending'
                          }`}
                        >
                          {application.status}
                        </span>
                        <button className="text-primary-600 hover:text-primary-700">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
                <div className="space-y-4">
                  {landlordData.messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{message.from}</h3>
                        <p className="text-sm text-gray-600">{message.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{message.date}</p>
                        {message.unread && (
                          <span className="inline-block w-2 h-2 bg-primary-600 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 