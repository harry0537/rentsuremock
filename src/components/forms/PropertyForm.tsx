'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { propertySchema, PropertyFormData } from '@/lib/validations/property';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { showToast } from '@/lib/toast';
import { Toaster } from 'react-hot-toast';
import {
  PhotoIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  isEditing?: boolean;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  isLoading?: boolean;
}

const amenitiesList = [
  'Air Conditioning', 'Heating', 'Dishwasher', 'Laundry', 'Gym', 'Pool',
  'Balcony', 'Fireplace', 'Walk-in Closet', 'Hardwood Floors', 'Carpet',
  'Tile Floors', 'Security System', 'Doorman', 'Elevator', 'Storage'
];

const nearbyFeaturesList = [
  'University/College', 'Public Transportation', 'Shopping Center', 'Grocery Store',
  'Restaurant', 'Hospital', 'Pharmacy', 'Bank', 'Gas Station', 'Gym',
  'Park', 'Library', 'Coffee Shop', 'Movie Theater', 'School'
];

export default function PropertyForm({ 
  initialData, 
  isEditing = false, 
  onSubmit,
  isLoading = false 
}: PropertyFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || []);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      bedrooms: 1,
      bathrooms: 1,
      squareFootage: undefined,
      propertyType: 'apartment',
      leaseType: 'yearly',
      availableDate: new Date().toISOString().split('T')[0],
      furnished: false,
      petPolicy: 'not-allowed',
      parking: 'none',
      utilities: {
        electricity: false,
        water: false,
        gas: false,
        internet: false,
        cable: false,
        trash: false,
      },
      amenities: [],
      nearbyFeatures: [],
      contactPhone: '',
      contactEmail: '',
      images: [],
      virtualTourUrl: '',
      specialInstructions: '',
      securityDeposit: undefined,
      applicationFee: undefined,
      minimumLeaseTerm: 12,
      status: 'draft',
      ...initialData,
    },
    mode: 'onChange'
  });

  const { register, handleSubmit, formState: { errors, isValid, isDirty }, watch, setValue, control } = form;

  const steps = [
    { id: 1, title: 'Basic Information', icon: '📋' },
    { id: 2, title: 'Property Details', icon: '🏠' },
    { id: 3, title: 'Features & Amenities', icon: '✨' },
    { id: 4, title: 'Images & Media', icon: '📸' },
    { id: 5, title: 'Contact & Policies', icon: '📞' },
  ];

  const handleImageUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    setImageUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          showToast.error(`${file.name} is too large. Maximum size is 5MB.`);
          continue;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          showToast.error(`${file.name} is not a supported format. Use JPEG, PNG, or WebP.`);
          continue;
        }

        // In a real app, upload to cloud storage (Cloudinary, AWS S3, etc.)
        // For demo, we'll create object URLs
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      }

      const updatedImages = [...uploadedImages, ...newImages];
      if (updatedImages.length > 10) {
        showToast.error('Maximum 10 images allowed');
        return;
      }

      setUploadedImages(updatedImages);
      setValue('images', updatedImages, { shouldValidate: true });
      showToast.success(`${newImages.length} image(s) uploaded successfully`);

    } catch (error) {
      console.error('Image upload error:', error);
      showToast.error('Failed to upload images');
    } finally {
      setImageUploading(false);
    }
  }, [uploadedImages, setValue]);

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setValue('images', updatedImages, { shouldValidate: true });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFormSubmit = async (data: PropertyFormData) => {
    try {
      await onSubmit(data);
      showToast.success(isEditing ? 'Property updated successfully!' : 'Property created successfully!');
      router.push('/dashboard/landlord');
    } catch (error) {
      console.error('Form submission error:', error);
      showToast.error('Failed to save property. Please try again.');
    }
  };

  const watchedAmenities = watch('amenities');
  const watchedNearbyFeatures = watch('nearbyFeatures');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Property' : 'List New Property'}
          </h1>
          <p className="text-gray-600">
            Fill out the details below to {isEditing ? 'update your' : 'create a new'} property listing.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${currentStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : currentStep > step.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-xs mt-2 text-center font-medium text-gray-600">
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`
                    hidden md:block absolute h-0.5 w-20 mt-5 transform translate-x-10
                    ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Title *
                        </label>
                        <Input
                          {...register('title')}
                          placeholder="e.g., Modern 2BR Apartment Near Campus"
                          error={errors.title?.message}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          {...register('description')}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe your property in detail..."
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Rent *
                        </label>
                        <Input
                          {...register('price', { valueAsNumber: true })}
                          type="number"
                          placeholder="2500"
                          error={errors.price?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Type *
                        </label>
                        <select
                          {...register('propertyType')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="apartment">Apartment</option>
                          <option value="house">House</option>
                          <option value="condo">Condo</option>
                          <option value="townhouse">Townhouse</option>
                          <option value="studio">Studio</option>
                          <option value="room">Room</option>
                        </select>
                        {errors.propertyType && (
                          <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lease Type *
                        </label>
                        <select
                          {...register('leaseType')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                          <option value="semester">Semester</option>
                          <option value="short-term">Short-term</option>
                        </select>
                        {errors.leaseType && (
                          <p className="mt-1 text-sm text-red-600">{errors.leaseType.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Date *
                        </label>
                        <Input
                          {...register('availableDate')}
                          type="date"
                          error={errors.availableDate?.message}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Property Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <Input
                          {...register('address')}
                          placeholder="123 Main Street, Apt 4B"
                          error={errors.address?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <Input
                          {...register('city')}
                          placeholder="San Francisco"
                          error={errors.city?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <Input
                          {...register('state')}
                          placeholder="California"
                          error={errors.state?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <Input
                          {...register('zipCode')}
                          placeholder="94102"
                          error={errors.zipCode?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location/Neighborhood *
                        </label>
                        <Input
                          {...register('location')}
                          placeholder="Mission District"
                          error={errors.location?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bedrooms *
                        </label>
                        <Input
                          {...register('bedrooms', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          max="20"
                          error={errors.bedrooms?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms *
                        </label>
                        <Input
                          {...register('bathrooms', { valueAsNumber: true })}
                          type="number"
                          min="0.5"
                          max="20"
                          step="0.5"
                          error={errors.bathrooms?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Square Footage
                        </label>
                        <Input
                          {...register('squareFootage', { valueAsNumber: true })}
                          type="number"
                          placeholder="800"
                          error={errors.squareFootage?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Lease Term (months) *
                        </label>
                        <Input
                          {...register('minimumLeaseTerm', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          max="60"
                          error={errors.minimumLeaseTerm?.message}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Features & Amenities */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pet Policy *
                        </label>
                        <select
                          {...register('petPolicy')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="not-allowed">No Pets</option>
                          <option value="allowed">Pets Allowed</option>
                          <option value="cats-only">Cats Only</option>
                          <option value="dogs-only">Dogs Only</option>
                          <option value="case-by-case">Case by Case</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parking *
                        </label>
                        <select
                          {...register('parking')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="none">No Parking</option>
                          <option value="street">Street Parking</option>
                          <option value="garage">Garage</option>
                          <option value="driveway">Driveway</option>
                          <option value="lot">Parking Lot</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('furnished')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Furnished</span>
                        </label>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Utilities Included
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['electricity', 'water', 'gas', 'internet', 'cable', 'trash'].map((utility) => (
                            <label key={utility} className="flex items-center">
                              <input
                                type="checkbox"
                                {...register(`utilities.${utility as keyof PropertyFormData['utilities']}`)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {utility}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Amenities
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {amenitiesList.map((amenity) => (
                            <label key={amenity} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={watchedAmenities?.includes(amenity) || false}
                                onChange={(e) => {
                                  const current = watchedAmenities || [];
                                  if (e.target.checked) {
                                    setValue('amenities', [...current, amenity]);
                                  } else {
                                    setValue('amenities', current.filter(a => a !== amenity));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Nearby Features
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {nearbyFeaturesList.map((feature) => (
                            <label key={feature} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={watchedNearbyFeatures?.includes(feature) || false}
                                onChange={(e) => {
                                  const current = watchedNearbyFeatures || [];
                                  if (e.target.checked) {
                                    setValue('nearbyFeatures', [...current, feature]);
                                  } else {
                                    setValue('nearbyFeatures', current.filter(f => f !== feature));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{feature}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Images & Media */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Images & Media</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Property Images * (1-10 images, max 5MB each)
                        </label>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          <div className="text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                              <label htmlFor="images" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                  Upload property images
                                </span>
                                <input
                                  id="images"
                                  type="file"
                                  multiple
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                  className="sr-only"
                                />
                                <span className="mt-2 block text-sm text-gray-500">
                                  PNG, JPG, WebP up to 5MB each
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {uploadedImages.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={image}
                                  alt={`Property image ${index + 1}`}
                                  width={200}
                                  height={150}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    Main
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {errors.images && (
                          <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Virtual Tour URL (optional)
                        </label>
                        <Input
                          {...register('virtualTourUrl')}
                          placeholder="https://example.com/virtual-tour"
                          error={errors.virtualTourUrl?.message}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Contact & Policies */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact & Policies</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone *
                        </label>
                        <Input
                          {...register('contactPhone')}
                          placeholder="(555) 123-4567"
                          error={errors.contactPhone?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Email *
                        </label>
                        <Input
                          {...register('contactEmail')}
                          type="email"
                          placeholder="landlord@example.com"
                          error={errors.contactEmail?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security Deposit
                        </label>
                        <Input
                          {...register('securityDeposit', { valueAsNumber: true })}
                          type="number"
                          placeholder="2500"
                          error={errors.securityDeposit?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application Fee
                        </label>
                        <Input
                          {...register('applicationFee', { valueAsNumber: true })}
                          type="number"
                          placeholder="50"
                          error={errors.applicationFee?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Status *
                        </label>
                        <select
                          {...register('status')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="rented">Rented</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions (optional)
                        </label>
                        <textarea
                          {...register('specialInstructions')}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Any special instructions for potential tenants..."
                        />
                        {errors.specialInstructions && (
                          <p className="mt-1 text-sm text-red-600">{errors.specialInstructions.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form Navigation */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 