'use client';

import { useState } from 'react';
import { useMaintenance } from '@/context/MaintenanceContext';
import { MaintenanceCategory, MaintenanceTag } from '@/types/maintenance';
import MaintenanceCategorySelect from './MaintenanceCategorySelect';
import MaintenanceTagInput from './MaintenanceTagInput';
import { toast } from 'react-hot-toast';

export interface MaintenanceRequestFormProps {
  propertyId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function MaintenanceRequestForm({
  propertyId,
  onSuccess,
  onCancel,
}: MaintenanceRequestFormProps) {
  const { createRequest } = useMaintenance();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'emergency'>('medium');
  const [category, setCategory] = useState<MaintenanceCategory>('other');
  const [tags, setTags] = useState<MaintenanceTag[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createRequest({
        propertyId,
        title,
        description,
        priority,
        category,
        tags,
        images,
        tenantId: '', // This will be set by the backend based on the authenticated user
        status: 'pending',
      });

      onSuccess();
    } catch (error: unknown) {
      console.error('Error submitting maintenance request:', error);
      setError('Failed to submit maintenance request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImages(prev => [...prev, data.url]);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <div className="mt-1">
          <MaintenanceCategorySelect
            selectedCategory={category}
            onChange={setCategory}
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="mt-1">
          <MaintenanceTagInput tags={tags} onTagsChange={setTags} />
        </div>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
          Images
        </label>
        <input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              files.forEach(handleImageUpload);
            }
          }}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
} 