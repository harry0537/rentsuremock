'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MaintenanceRequest, MaintenanceNote } from '@/types/maintenance';

interface MaintenanceContextType {
  requests: MaintenanceRequest[];
  loading: boolean;
  error: string | null;
  getRequestsByProperty: (propertyId: string) => Promise<MaintenanceRequest[]>;
  createRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, request: Partial<MaintenanceRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  addNote: (requestId: string, note: Omit<MaintenanceNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  getNotes: (requestId: string) => Promise<MaintenanceNote[]>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRequestsByProperty = async (propertyId: string): Promise<MaintenanceRequest[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/maintenance?propertyId=${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch maintenance requests');
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Failed to create maintenance request');
      const newRequest = await response.json();
      setRequests((prev: MaintenanceRequest[]) => [...prev, newRequest]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: string, request: Partial<MaintenanceRequest>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Failed to update maintenance request');
      const updatedRequest = await response.json();
      setRequests((prev: MaintenanceRequest[]) =>
        prev.map((r: MaintenanceRequest) => (r.id === id ? { ...r, ...updatedRequest } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete maintenance request');
      setRequests((prev: MaintenanceRequest[]) => prev.filter((r: MaintenanceRequest) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (requestId: string, note: Omit<MaintenanceNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/maintenance/${requestId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (!response.ok) throw new Error('Failed to add note');
      const newNote = await response.json();
      setRequests((prev: MaintenanceRequest[]) =>
        prev.map((r: MaintenanceRequest) =>
          r.id === requestId
            ? { ...r, notes: [...(r.notes || []), newNote.id] }
            : r
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNotes = async (requestId: string): Promise<MaintenanceNote[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/maintenance/${requestId}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MaintenanceContext.Provider
      value={{
        requests,
        loading,
        error,
        getRequestsByProperty,
        createRequest,
        updateRequest,
        deleteRequest,
        addNote,
        getNotes,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
} 