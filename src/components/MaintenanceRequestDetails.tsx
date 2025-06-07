'use client';

import { useState, useEffect } from 'react';
import { useMaintenance } from '@/context/MaintenanceContext';
import { MaintenanceRequest } from '@/types/maintenance';
import NotificationToast from './NotificationToast';

interface MaintenanceRequestDetailsProps {
  request: MaintenanceRequest;
  onClose: () => void;
}

export default function MaintenanceRequestDetails({
  request,
  onClose,
}: MaintenanceRequestDetailsProps) {
  const { updateRequest, addNote, getNotes } = useMaintenance();
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    loadNotes();
  }, [request.id]);

  const loadNotes = async () => {
    try {
      const requestNotes = await getNotes(request.id);
      setNotes(requestNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      showNotification('error', 'Error', 'Failed to load notes');
    }
  };

  const showNotification = (
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string
  ) => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsSubmitting(true);
      await updateRequest(request.id, { status: newStatus });
      showNotification(
        'success',
        'Status Updated',
        `Maintenance request status updated to ${newStatus}`
      );
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('error', 'Error', 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setIsSubmitting(true);
      await addNote(request.id, newNote);
      setNewNote('');
      await loadNotes();
      showNotification('success', 'Note Added', 'Your note has been added');
    } catch (error) {
      console.error('Error adding note:', error);
      showNotification('error', 'Error', 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string): string => {
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

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {request.title}
          </h3>
          <div className="flex space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                request.status
              )}`}
            >
              {request.status.replace('_', ' ')}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                request.priority
              )}`}
            >
              {request.priority}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">{request.description}</p>
        </div>

        {request.images && request.images.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Images</h4>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {request.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Maintenance request image ${index + 1}`}
                  className="h-32 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Update Status</h4>
          <div className="mt-2 flex space-x-2">
            {['pending', 'in_progress', 'completed', 'cancelled'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isSubmitting || request.status === status}
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                    request.status === status
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Notes</h4>
          <div className="mt-2 space-y-4">
            {notes.map((note, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500"
              >
                {note}
              </div>
            ))}
          </div>

          <form onSubmit={handleAddNote} className="mt-4">
            <div>
              <label htmlFor="note" className="sr-only">
                Add a note
              </label>
              <textarea
                id="note"
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add a note..."
              />
            </div>
            <div className="mt-3">
              <button
                type="submit"
                disabled={isSubmitting || !newNote.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <NotificationToast
        show={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
} 