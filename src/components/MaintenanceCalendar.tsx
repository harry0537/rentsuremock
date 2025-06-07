import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { MaintenanceRequest } from '@/types/maintenance';

interface MaintenanceCalendarProps {
  requests: MaintenanceRequest[];
  onRequestClick: (request: MaintenanceRequest) => void;
}

export default function MaintenanceCalendar({
  requests,
  onRequestClick,
}: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getRequestColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestsForDay = (day: number) => {
    return requests.filter((request) => {
      const requestDate = new Date(request.createdAt);
      return (
        requestDate.getDate() === day &&
        requestDate.getMonth() === currentDate.getMonth() &&
        requestDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{getMonthName(currentDate)}</h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] bg-white p-2 ${
                day === null ? 'bg-gray-50' : ''
              }`}
            >
              {day && (
                <>
                  <div className="text-sm text-gray-500 mb-1">{day}</div>
                  <div className="space-y-1">
                    {getRequestsForDay(day).map((request) => (
                      <button
                        key={request.id}
                        onClick={() => onRequestClick(request)}
                        className={`w-full text-left px-2 py-1 text-xs rounded truncate ${getRequestColor(
                          request.status
                        )}`}
                      >
                        {request.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 