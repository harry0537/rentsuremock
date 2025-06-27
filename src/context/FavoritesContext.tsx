'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { showToast } from '@/lib/toast';

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  addFavorite: (propertyId: string) => Promise<void>;
  removeFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addFavorite = async (propertyId: string) => {
    if (!user) {
      showToast.error('Please log in to save favorites');
      return;
    }

    try {
      setLoading(true);

      // Optimistic update
      setFavorites(prev => [...prev, propertyId]);

      // Make API call to save favorite
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }

      showToast.success('Added to favorites');
    } catch (error) {
      // Revert optimistic update on error
      setFavorites(prev => prev.filter(id => id !== propertyId));
      console.error('Error adding favorite:', error);
      showToast.error('Failed to add to favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) {
      showToast.error('Please log in to manage favorites');
      return;
    }

    try {
      setLoading(true);

      // Optimistic update
      setFavorites(prev => prev.filter(id => id !== propertyId));

      // Make API call to remove favorite
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      showToast.success('Removed from favorites');
    } catch (error) {
      // Revert optimistic update on error
      setFavorites(prev => [...prev, propertyId]);
      console.error('Error removing favorite:', error);
      showToast.error('Failed to remove from favorites');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        loading, 
        addFavorite, 
        removeFavorite, 
        isFavorite 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 