import { useState, KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { MaintenanceTag } from '@/types/maintenance';

interface MaintenanceTagInputProps {
  tags: MaintenanceTag[];
  onTagsChange: (tags: MaintenanceTag[]) => void;
}

const TAG_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-red-100 text-red-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800',
];

export default function MaintenanceTagInput({ tags, onTagsChange }: MaintenanceTagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag: MaintenanceTag = {
        id: Math.random().toString(36).substr(2, 9),
        name: inputValue.trim(),
        color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
      };
      onTagsChange([...tags, newTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagId: string) => {
    onTagsChange(tags.filter((tag) => tag.id !== tagId));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tag.color}`}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags (press Enter)"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
  );
} 