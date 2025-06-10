import { useState, useEffect, useCallback } from 'react';
import { useMaintenance } from '@/hooks/useMaintenance';
import { MaintenanceRequest } from '@/types/maintenance';
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  averageResolutionTime: number;
  highPriorityRequests: number;
}

export default function LandlordDashboard() {
  const { getRequestsByProperty, getPropertiesByLandlord } = useMaintenance();
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    averageResolutionTime: 0,
    highPriorityRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const requests = await getRequestsByProperty('1');
      
      // Calculate stats
      const newStats: DashboardStats = {
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        inProgressRequests: requests.filter(r => r.status === 'in_progress').length,
        completedRequests: requests.filter(r => r.status === 'completed').length,
        averageResolutionTime: calculateAverageResolutionTime(requests),
        highPriorityRequests: requests.filter(r => 
          r.priority === 'high' || r.priority === 'emergency'
        ).length,
      };

      setStats(newStats);
      setRecentRequests(
        requests
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      );
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [getRequestsByProperty]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const calculateAverageResolutionTime = (requests: MaintenanceRequest[]): number => {
    const completedRequests = requests.filter(r => r.status === 'completed');
    if (completedRequests.length === 0) return 0;

    const totalTime = completedRequests.reduce((acc, req) => {
      const start = new Date(req.createdAt).getTime();
      const end = new Date(req.completedAt || Date.now()).getTime();
      return acc + (end - start);
    }, 0);

    return Math.round(totalTime / completedRequests.length / (1000 * 60 * 60)); // Convert to hours
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalRequests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingRequests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* High Priority Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High Priority</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.highPriorityRequests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.inProgressRequests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completedRequests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Average Resolution Time */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Resolution Time</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.averageResolutionTime}h</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Requests</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {recentRequests.map((request) => (
              <li key={request.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">{request.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.priority === 'high' || request.priority === 'emergency'
                          ? 'bg-red-100 text-red-800'
                          : request.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {request.priority}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : request.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {request.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Created {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 