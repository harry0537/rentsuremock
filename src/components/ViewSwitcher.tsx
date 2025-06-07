import { ListBulletIcon, CalendarIcon } from '@heroicons/react/20/solid';

interface ViewSwitcherProps {
  currentView: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => onViewChange('list')}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md ${
          currentView === 'list'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
      >
        <ListBulletIcon className="h-5 w-5 mr-2" />
        List
      </button>
      <button
        type="button"
        onClick={() => onViewChange('calendar')}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md ${
          currentView === 'calendar'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
      >
        <CalendarIcon className="h-5 w-5 mr-2" />
        Calendar
      </button>
    </div>
  );
} 