'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LandlordDashboard from '@/components/LandlordDashboard';
import Button from '@/components/ui/Button';
import { motion } from '@/lib/motion';
import {
  UserIcon,
  HomeIcon,
  HeartIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect landlords to their dedicated dashboard
    if (user?.role === 'landlord') {
      router.push('/dashboard/landlord');
    }
  }, [user, router]);

  // Show loading while redirecting landlords
  if (user?.role === 'landlord') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to landlord dashboard...</p>
        </div>
      </div>
    );
  }

  // Tenant/Student Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'tenant' 
              ? 'Find your perfect place to study and live' 
              : 'Manage your rentals and find great properties'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickActionCard
            title="Browse Listings"
            description="Explore available properties"
            icon={HomeIcon}
            onClick={() => router.push('/listings')}
            color="blue"
          />
          <QuickActionCard
            title="My Favorites"
            description="View saved properties"
            icon={HeartIcon}
            onClick={() => router.push('/favorites')}
            color="red"
          />
          <QuickActionCard
            title="Messages"
            description="Chat with landlords"
            icon={UserIcon}
            onClick={() => router.push('/messages')}
            color="green"
          />
          <QuickActionCard
            title="Reviews"
            description="Read and write reviews"
            icon={ChartBarIcon}
            onClick={() => router.push('/reviews')}
            color="purple"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Searches */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Searches</h2>
            <div className="space-y-3">
              {[
                { query: '2 bedroom apartment', location: 'Downtown', time: '2 hours ago' },
                { query: 'Studio near campus', location: 'University District', time: '1 day ago' },
                { query: 'Pet-friendly housing', location: 'Westside', time: '3 days ago' }
              ].map((search, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{search.query}</p>
                    <p className="text-sm text-gray-500">{search.location}</p>
                  </div>
                  <span className="text-xs text-gray-400">{search.time}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => router.push('/listings')}
            >
              Browse All Properties
            </Button>
          </div>

          {/* Saved Properties */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Properties</h2>
            <div className="space-y-3">
              {[
                { title: 'Modern Studio Apartment', price: '$1,200', location: 'Downtown' },
                { title: 'Cozy 2BR Near Campus', price: '$1,800', location: 'University District' },
                { title: 'Luxury Loft with View', price: '$2,400', location: 'Westside' }
              ].map((property, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{property.title}</p>
                    <p className="text-sm text-gray-500">{property.location}</p>
                  </div>
                  <span className="font-semibold text-blue-600">{property.price}/mo</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => router.push('/favorites')}
            >
              View All Favorites
            </Button>
          </div>
        </div>

        {/* Tips for Tenants */}
        {user?.role === 'tenant' && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Rental Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Budget Planning</h3>
                <p className="text-sm text-gray-600">
                  Aim to spend no more than 30% of your income on rent. Factor in utilities and other expenses.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Location Matters</h3>
                <p className="text-sm text-gray-600">
                  Consider proximity to campus, public transportation, and essential amenities.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Roommate Compatibility</h3>
                <p className="text-sm text-gray-600">
                  Discuss living habits, schedules, and expectations before committing.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Read the Lease</h3>
                <p className="text-sm text-gray-600">
                  Understand all terms, including pet policies, subletting rules, and maintenance responsibilities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Role Upgrade Option */}
        {user?.role === 'tenant' && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Are you a property owner?
                </h2>
                <p className="text-gray-600">
                  Join as a landlord to list your properties and manage rentals.
                </p>
              </div>
              <Button className="mt-4 md:mt-0">
                <PlusIcon className="h-5 w-5 mr-2" />
                Become a Landlord
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Action Card Component
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color: 'blue' | 'red' | 'green' | 'purple';
}

function QuickActionCard({ title, description, icon: Icon, onClick, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 group-hover:bg-blue-600',
    red: 'bg-red-500 group-hover:bg-red-600',
    green: 'bg-green-500 group-hover:bg-green-600',
    purple: 'bg-purple-500 group-hover:bg-purple-600'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4 transition-colors`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
} 