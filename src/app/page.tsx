import Link from 'next/link'
import { FaHome, FaKey } from 'react-icons/fa'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Home
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Verified. Secure. Rent Easy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/listings" className="btn-secondary flex items-center justify-center gap-2">
                <FaHome className="w-5 h-5" />
                Browse Rentals
              </Link>
              <Link href="/auth/signup?role=landlord" className="bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <FaKey className="w-5 h-5" />
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RentSure?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">Every listing is verified for accuracy and legitimacy.</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaKey className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Process</h3>
              <p className="text-gray-600">Safe and secure rental process from start to finish.</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Communication</h3>
              <p className="text-gray-600">Direct messaging with verified landlords and tenants.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 