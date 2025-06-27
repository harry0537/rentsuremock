'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  PlusIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: 'Browse Properties',
      href: '/listings',
      icon: HomeIcon,
      show: true
    },
    {
      label: 'Dashboard',
      href: user?.role === 'landlord' ? '/dashboard/landlord' : '/dashboard',
      icon: ChartBarIcon,
      show: !!user
    },
    {
      label: 'My Properties',
      href: '/properties',
      icon: BuildingOfficeIcon,
      show: user?.role === 'landlord'
    },
    {
      label: 'Favorites',
      href: '/favorites',
      icon: HeartIcon,
      show: !!user
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: ChatBubbleLeftRightIcon,
      show: !!user
    },
    {
      label: 'Add Property',
      href: '/properties/new',
      icon: PlusIcon,
      show: user?.role === 'landlord',
      highlight: true
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">RS</span>
                  </div>
                  <span className="font-bold text-gray-900">RentSure</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="flex-1 py-4">
                <nav className="space-y-1">
                  {menuItems
                    .filter(item => item.show)
                    .map((item) => {
                      const isActive = pathname === item.href;
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`
                            flex items-center px-4 py-3 text-sm font-medium transition-colors
                            ${isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }
                            ${item.highlight ? 'bg-green-50 text-green-700' : ''}
                          `}
                        >
                          <IconComponent className="h-5 w-5 mr-3" />
                          {item.label}
                          {item.highlight && (
                            <PlusIcon className="h-4 w-4 ml-auto" />
                          )}
                        </Link>
                      );
                    })}
                </nav>
              </div>

              {/* Auth Section */}
              <div className="border-t border-gray-200 p-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="flex items-center w-full px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              {user?.role !== 'landlord' && (
                <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-green-50 to-blue-50">
                  <p className="text-xs text-gray-600 mb-2">Are you a property owner?</p>
                  <Link
                    href="/auth/signup?role=landlord"
                    className="flex items-center w-full px-3 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
                  >
                    <BuildingOfficeIcon className="h-5 w-5 mr-3" />
                    Become a Landlord
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 