'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import PropertyCard from '@/components/PropertyCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Button from '@/components/ui/Button';
import { HeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { showToast } from '@/lib/toast';
import { Toaster } from 'react-hot-toast';
import { Property } from '@/types/property';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchFavoriteProperties();
  }, [user, favorites]);

  const fetchFavoriteProperties = async () => {
    if (favorites.length === 0) {
      setFavoriteProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch all properties and filter by favorites
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const allProperties = await response.json();
      const filteredProperties = allProperties.filter((property: Property) => 
        favorites.includes(property._id)
      );
      
      setFavoriteProperties(filteredProperties);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view favorites</h1>
          <p className="text-gray-600 mb-6">
            Create an account or sign in to save and manage your favorite properties.
          </p>
          <div className="space-y-3">
            <Link href="/auth/login">
              <Button fullWidth>
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" fullWidth>
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader key={index} variant="card" />
            ))}
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
            <h3 className="text-lg font-medium text-red-800 mb-2">Error loading favorites</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchFavoriteProperties} variant="danger">
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
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            {favoriteProperties.length === 0 
              ? "You haven't saved any properties yet" 
              : `${favoriteProperties.length} ${favoriteProperties.length === 1 ? 'property' : 'properties'} saved`
            }
          </p>
        </div>

        {/* Content */}
        {favoriteProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <HeartIcon className="h-24 w-24 mx-auto text-gray-300 mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">No favorites yet</h3>
              <p className="text-gray-600 mb-6">
                Start exploring properties and click the heart icon to save your favorites here.
              </p>
              <Link href="/listings">
                <Button className="inline-flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {favoriteProperties.map((property) => (
                 <PropertyCard
                   key={property._id}
                   property={property}
                 />
               ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Keep exploring
                </h3>
                <p className="text-gray-600 mb-6">
                  Discover more amazing properties that might interest you.
                </p>
                <Link href="/listings">
                  <Button className="inline-flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    View All Properties
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 