'use client';

import { useEffect, useState } from 'react';
import { motion } from '@/lib/motion';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PropertyTable from '@/components/dashboard/PropertyTable';
import PropertyStats from '@/components/dashboard/PropertyStats';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import Button from '@/components/ui/Button';
import { showToast } from '@/lib/toast';
import { Toaster } from 'react-hot-toast';
import {
  PlusIcon,
  HomeIcon,
  EyeIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  views: number;
  favorites: number;
  createdAt: string;
  images: string[];
}

interface DashboardStats {
  totalProperties: number;
  totalViews: number;
  totalFavorites: number;
  averagePrice: number;
  occupancyRate: number;
  monthlyRevenue: number;
}

export default function LandlordDashboardPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <LandlordDashboardContent />
    </ProtectedRoute>
  );
}

function LandlordDashboardContent() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'analytics'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch properties (in real app, filter by landlord ID)
      const propertiesResponse = await fetch('/api/properties');
      if (!propertiesResponse.ok) {
        throw new Error('Failed to fetch properties');
      }
      const propertiesData = await propertiesResponse.json();
      
      // Add mock analytics data
      const propertiesWithAnalytics = propertiesData.map((property: any) => ({
        ...property,
        views: Math.floor(Math.random() * 500) + 50,
        favorites: Math.floor(Math.random() * 50) + 5,
      }));

      setProperties(propertiesWithAnalytics);

      // Calculate stats
      const totalProperties = propertiesWithAnalytics.length;
      const totalViews = propertiesWithAnalytics.reduce((sum: number, p: Property) => sum + p.views, 0);
      const totalFavorites = propertiesWithAnalytics.reduce((sum: number, p: Property) => sum + p.favorites, 0);
      const averagePrice = totalProperties > 0 
        ? propertiesWithAnalytics.reduce((sum: number, p: Property) => sum + p.price, 0) / totalProperties 
        : 0;

      setStats({
        totalProperties,
        totalViews,
        totalFavorites,
        averagePrice,
        occupancyRate: 85, // Mock data
        monthlyRevenue: propertiesWithAnalytics.reduce((sum: number, p: Property) => sum + p.price, 0),
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'properties', label: 'Properties', icon: Cog6ToothIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error loading dashboard</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchDashboardData} variant="danger">
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">Manage your properties and track performance</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0"
            onClick={() => window.location.href = '/properties/new'}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && <PropertyStats stats={stats} />}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <OverviewTab properties={properties} stats={stats} />
              )}
              {activeTab === 'properties' && (
                <PropertyTable 
                  properties={properties} 
                  onRefresh={fetchDashboardData}
                />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsChart properties={properties} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ properties, stats }: { properties: Property[]; stats: DashboardStats | null }) {
  const recentProperties = properties.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProperties.map((property) => (
            <div key={property._id} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{property.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{property.location}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-blue-600">
                  ${property.price.toLocaleString()}/mo
                </span>
                <div className="flex items-center space-x-3 text-gray-500">
                  <span className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {property.views}
                  </span>
                  <span className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    {property.favorites}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex-col">
            <PlusIcon className="h-6 w-6 mb-2" />
            Add Property
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col">
            <ChartBarIcon className="h-6 w-6 mb-2" />
            View Analytics
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col">
            <CurrencyDollarIcon className="h-6 w-6 mb-2" />
            Revenue Report
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col">
            <Cog6ToothIcon className="h-6 w-6 mb-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
} 