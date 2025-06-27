'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Property {
  _id: string;
  title: string;
  price: number;
  views: number;
  favorites: number;
  createdAt: string;
}

interface AnalyticsChartProps {
  properties: Property[];
}

export default function AnalyticsChart({ properties }: AnalyticsChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [chartType, setChartType] = useState<'views' | 'favorites' | 'revenue'>('views');

  // Generate mock analytics data
  const analyticsData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let value;
      switch (chartType) {
        case 'views':
          value = Math.floor(Math.random() * 100) + 20;
          break;
        case 'favorites':
          value = Math.floor(Math.random() * 20) + 5;
          break;
        case 'revenue':
          value = Math.floor(Math.random() * 5000) + 1000;
          break;
        default:
          value = 0;
      }

      data.push({
        date: date.toISOString().split('T')[0],
        value,
        label: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }

    return data;
  }, [timeRange, chartType]);

  const maxValue = Math.max(...analyticsData.map(d => d.value));
  const minValue = Math.min(...analyticsData.map(d => d.value));
  const avgValue = analyticsData.reduce((sum, d) => sum + d.value, 0) / analyticsData.length;

  const getChartColor = () => {
    switch (chartType) {
      case 'views': return 'rgb(59, 130, 246)'; // Blue
      case 'favorites': return 'rgb(239, 68, 68)'; // Red
      case 'revenue': return 'rgb(34, 197, 94)'; // Green
      default: return 'rgb(59, 130, 246)';
    }
  };

  const formatValue = (value: number) => {
    switch (chartType) {
      case 'revenue': return `$${value.toLocaleString()}`;
      default: return value.toString();
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'views': return 'Property Views';
      case 'favorites': return 'Favorites Added';
      case 'revenue': return 'Revenue';
      default: return 'Analytics';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Analytics Dashboard
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Chart Type */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="views">Views</option>
            <option value="favorites">Favorites</option>
            <option value="revenue">Revenue</option>
          </select>

          {/* Time Range */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatValue(Math.round(avgValue))}
              </p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Peak</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatValue(maxValue)}
              </p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Minimum</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatValue(minValue)}
              </p>
            </div>
            <ArrowTrendingDownIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-6">{getChartTitle()}</h4>
        
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
            <span>{formatValue(maxValue)}</span>
            <span>{formatValue(Math.round(maxValue * 0.75))}</span>
            <span>{formatValue(Math.round(maxValue * 0.5))}</span>
            <span>{formatValue(Math.round(maxValue * 0.25))}</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div
                  key={percent}
                  className="absolute w-full border-t border-gray-100"
                  style={{ top: `${100 - percent}%` }}
                />
              ))}
            </div>

            {/* Chart bars */}
            <div className="relative h-full flex items-end justify-between px-2">
              {analyticsData.map((dataPoint, index) => {
                const height = (dataPoint.value / maxValue) * 100;
                
                return (
                  <motion.div
                    key={dataPoint.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative flex-1 mx-1 min-w-0"
                  >
                    <div
                      className="w-full rounded-t-sm transition-all duration-200 group-hover:opacity-80"
                      style={{ 
                        backgroundColor: getChartColor(),
                        height: '100%'
                      }}
                    />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                      {dataPoint.label}: {formatValue(dataPoint.value)}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
              {analyticsData.map((dataPoint, index) => {
                // Show every nth label to avoid overcrowding
                const showLabel = index % Math.ceil(analyticsData.length / 7) === 0;
                return (
                  <span key={dataPoint.date} className={showLabel ? '' : 'invisible'}>
                    {dataPoint.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Properties */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Top Performing Properties</h4>
        <div className="space-y-3">
          {properties
            .sort((a, b) => (chartType === 'views' ? b.views - a.views : b.favorites - a.favorites))
            .slice(0, 5)
            .map((property, index) => (
              <div key={property._id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{property.title}</p>
                    <p className="text-sm text-gray-500">${property.price.toLocaleString()}/mo</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {chartType === 'views' ? property.views : property.favorites}
                  </p>
                  <p className="text-sm text-gray-500">
                    {chartType === 'views' ? 'views' : 'favorites'}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 