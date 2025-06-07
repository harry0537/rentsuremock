import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid';

interface MaintenanceFiltersProps {
  onFilterChange: (filters: {
    status: string;
    priority: string;
    category: string;
    dateRange: string;
  }) => void;
  onSortChange: (sortBy: string) => void;
  filters: {
    status: string;
    priority: string;
    category: string;
    dateRange: string;
  };
  sortBy: string;
}

export default function MaintenanceFilters({
  onFilterChange,
  onSortChange,
  filters,
  sortBy,
}: MaintenanceFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'emergency', label: 'Emergency' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'structural', label: 'Structural' },
    { value: 'appliance', label: 'Appliance' },
    { value: 'pest_control', label: 'Pest Control' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'security', label: 'Security' },
    { value: 'other', label: 'Other' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_year', label: 'This Year' },
  ];

  const sortOptions = [
    { field: 'createdAt', label: 'Date Created' },
    { field: 'status', label: 'Status' },
    { field: 'priority', label: 'Priority' },
    { field: 'category', label: 'Category' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Status Filter */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
          Status
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {statusOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        onFilterChange({
                          status: option.value,
                          priority: 'all',
                          dateRange: 'all',
                          category: 'all',
                        })
                      }
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full text-left px-4 py-2 text-sm`}
                    >
                      {option.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Priority Filter */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
          Priority
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {priorityOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        onFilterChange({
                          status: 'all',
                          priority: option.value,
                          dateRange: 'all',
                          category: 'all',
                        })
                      }
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full text-left px-4 py-2 text-sm`}
                    >
                      {option.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Category Filter */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
          Category
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {categoryOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        onFilterChange({
                          status: 'all',
                          priority: 'all',
                          dateRange: 'all',
                          category: option.value,
                        })
                      }
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full text-left px-4 py-2 text-sm`}
                    >
                      {option.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Date Range Filter */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
          Date Range
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {dateRangeOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        onFilterChange({
                          status: 'all',
                          priority: 'all',
                          dateRange: option.value,
                          category: 'all',
                        })
                      }
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full text-left px-4 py-2 text-sm`}
                    >
                      {option.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Sort Options */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
          Sort By
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {sortOptions.map((option) => (
                <Menu.Item key={option.field}>
                  {({ active }) => (
                    <div className="flex flex-col">
                      <button
                        onClick={() =>
                          onSortChange(option.field)
                        }
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        {option.label}
                      </button>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
} 