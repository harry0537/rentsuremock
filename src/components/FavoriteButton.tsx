'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  showText?: boolean;
}

export default function FavoriteButton({ 
  propertyId, 
  className = '',
  size = 'md',
  variant = 'icon',
  showText = false
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, loading } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorite = isFavorite(propertyId);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // You could trigger a login modal here
      return;
    }

    setIsAnimating(true);
    
    try {
      if (favorite) {
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
      }
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={!user || loading}
        className={`
          inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${favorite 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }
          ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        <motion.div
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          {favorite ? (
            <HeartSolidIcon className={`${iconSizes[size]} ${showText ? 'mr-2' : ''}`} />
          ) : (
            <HeartIcon className={`${iconSizes[size]} ${showText ? 'mr-2' : ''}`} />
          )}
          {showText && (favorite ? 'Saved' : 'Save')}
        </motion.div>
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleToggleFavorite}
      disabled={!user || loading}
      className={`
        ${buttonSizes[size]} 
        rounded-full 
        transition-all 
        duration-200 
        ${favorite 
          ? 'bg-red-500 text-white shadow-lg hover:bg-red-600' 
          : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-md hover:shadow-lg'
        }
        ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={user ? { scale: 1.05 } : {}}
      whileTap={user ? { scale: 0.95 } : {}}
      title={
        !user 
          ? 'Log in to save favorites' 
          : favorite 
            ? 'Remove from favorites' 
            : 'Add to favorites'
      }
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {favorite ? (
          <HeartSolidIcon className={`${iconSizes[size]} text-current`} />
        ) : (
          <HeartIcon className={`${iconSizes[size]} text-current`} />
        )}
      </motion.div>
    </motion.button>
  );
} 