'use client';

import { motion } from 'framer-motion';
import {
  HomeIcon,
  EyeIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalProperties: number;
  totalViews: number;
  totalFavorites: number;
  averagePrice: number;
  occupancyRate: number;
  monthlyRevenue: number;
}

interface PropertyStatsProps {
  stats: DashboardStats;
}

export default function PropertyStats({ stats }: PropertyStatsProps) {
  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: HomeIcon,
      color: 'blue',
      change: '+2',
      changeType: 'increase' as const,
      subtitle: 'Active listings'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: EyeIcon,
      color: 'green',
      change: '+12%',
      changeType: 'increase' as const,
      subtitle: 'This month'
    },
    {
      title: 'Favorites',
      value: stats.totalFavorites.toLocaleString(),
      icon: HeartIcon,
      color: 'red',
      change: '+8%',
      changeType: 'increase' as const,
      subtitle: 'Saved by users'
    },
    {
      title: 'Avg. Price',
      value: `$${Math.round(stats.averagePrice).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'yellow',
      change: '+5%',
      changeType: 'increase' as const,
      subtitle: 'Per month'
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      icon: ChartBarIcon,
      color: 'purple',
      change: '-2%',
      changeType: 'decrease' as const,
      subtitle: 'Current rate'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'indigo',
      change: '+15%',
      changeType: 'increase' as const,
      subtitle: 'Projected'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        lightBg: 'bg-blue-50'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-600',
        lightBg: 'bg-green-50'
      },
      red: {
        bg: 'bg-red-500',
        text: 'text-red-600',
        lightBg: 'bg-red-50'
      },
      yellow: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-600',
        lightBg: 'bg-yellow-50'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        lightBg: 'bg-purple-50'
      },
      indigo: {
        bg: 'bg-indigo-500',
        text: 'text-indigo-600',
        lightBg: 'bg-indigo-50'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const colorClasses = getColorClasses(stat.color);
        const IconComponent = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorClasses.lightBg}`}>
                <IconComponent className={`h-6 w-6 ${colorClasses.text}`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'increase' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-xs text-gray-500">
                {stat.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 