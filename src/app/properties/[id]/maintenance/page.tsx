'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMaintenance } from '@/context/MaintenanceContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MaintenanceRequestForm from '@/components/MaintenanceRequestForm';
import MaintenanceRequestDetails from '@/components/MaintenanceRequestDetails';
import MaintenanceFilters from '@/components/MaintenanceFilters';
import MaintenanceSearch from '@/components/MaintenanceSearch';
import MaintenanceCalendar from '@/components/MaintenanceCalendar';
import ViewSwitcher from '@/components/ViewSwitcher';
import { MaintenanceRequest } from '@/types/maintenance';

const fetchRequests = async (getRequestsByProperty: (propertyId: string) => Promise<MaintenanceRequest[]>, propertyId: string): Promise<MaintenanceRequest[]> => {
  try {
    const data = await getRequestsByProperty(propertyId);
    return data;
  } catch (error: unknown) {
    console.error('Error fetching maintenance requests:', error);
    return [];
  }
};

export default function MaintenanceRequestsPage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getRequestsByProperty } = useMaintenance();
  const params = useParams();
  const propertyId = params?.id as string;
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    dateRange: 'all',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const data = await fetchRequests(getRequestsByProperty, propertyId);
        setRequests(data);
        setError(null);
      } catch (err) {
        setError('Failed to load maintenance requests');
        console.error('Error loading maintenance requests:', err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      loadRequests();
    }
  }, [propertyId, getRequestsByProperty]);

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRequestClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };

  const filteredRequests = requests
    .filter((request) => {
      const matchesStatus = filters.status === 'all' || request.status === filters.status;
      const matchesPriority = filters.priority === 'all' || request.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || request.category === filters.category;
      const matchesSearch = searchQuery === '' || 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const requestDate = new Date(request.createdAt);
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));

        switch (filters.dateRange) {
          case 'last7days':
            matchesDate = requestDate >= sevenDaysAgo;
            break;
          case 'last30days':
            matchesDate = requestDate >= thirtyDaysAgo;
            break;
        }
      }

      return matchesStatus && matchesPriority && matchesCategory && matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          return b.priority.localeCompare(a.priority);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading maintenance requests</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Maintenance Requests</h1>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              New Request
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
                <div className="flex-1">
                  <MaintenanceSearch onSearch={handleSearch} />
                </div>
                <div className="flex items-center space-x-4">
                  <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
                  <MaintenanceFilters
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              {currentView === 'list' ? (
                <div className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new maintenance request.
                      </p>
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <div
                        key={request.id}
                        onClick={() => setSelectedRequest(request)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                            <p className="mt-1 text-sm text-gray-500">{request.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : request.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {request.priority}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : request.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : request.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{request.category}</span>
                          {request.tags.length > 0 && (
                            <>
                              <span className="mx-2">•</span>
                              <div className="flex flex-wrap gap-1">
                                {request.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <MaintenanceCalendar
                  requests={filteredRequests}
                  onRequestClick={setSelectedRequest}
                />
              )}
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">New Maintenance Request</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <MaintenanceRequestForm
                  propertyId={propertyId}
                  onSuccess={() => {
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {selectedRequest && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Maintenance Request Details</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <MaintenanceRequestDetails
                  request={selectedRequest}
                  onClose={() => setSelectedRequest(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 