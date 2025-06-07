import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { MaintenanceCategory } from '@/types/maintenance';

interface MaintenanceCategorySelectProps {
  selectedCategory: MaintenanceCategory;
  onChange: (category: MaintenanceCategory) => void;
}

const categories: { value: MaintenanceCategory; label: string; icon: string }[] = [
  { value: 'plumbing', label: 'Plumbing', icon: '🚰' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'hvac', label: 'HVAC', icon: '❄️' },
  { value: 'structural', label: 'Structural', icon: '🏗️' },
  { value: 'appliance', label: 'Appliance', icon: '🔌' },
  { value: 'pest_control', label: 'Pest Control', icon: '🐜' },
  { value: 'landscaping', label: 'Landscaping', icon: '🌳' },
  { value: 'security', label: 'Security', icon: '🔒' },
  { value: 'other', label: 'Other', icon: '📝' },
];

export default function MaintenanceCategorySelect({
  selectedCategory,
  onChange,
}: MaintenanceCategorySelectProps) {
  const selected = categories.find((cat) => cat.value === selectedCategory);

  return (
    <Listbox value={selectedCategory} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">
            {selected?.icon} {selected?.label}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {categories.map((category) => (
              <Listbox.Option
                key={category.value}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                  }`
                }
                value={category.value}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {category.icon} {category.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
} 