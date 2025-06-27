import { z } from 'zod';

// Property validation schema
export const propertySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
    
  price: z
    .number()
    .positive('Price must be a positive number')
    .min(100, 'Minimum price is $100')
    .max(50000, 'Maximum price is $50,000'),
    
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location must be less than 200 characters')
    .trim(),
    
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(300, 'Address must be less than 300 characters')
    .trim(),
    
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters')
    .trim(),
    
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .trim(),
    
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),
    
  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Minimum 0 bedrooms')
    .max(20, 'Maximum 20 bedrooms'),
    
  bathrooms: z
    .number()
    .min(0.5, 'Minimum 0.5 bathrooms')
    .max(20, 'Maximum 20 bathrooms')
    .multipleOf(0.5, 'Bathrooms must be in increments of 0.5'),
    
  squareFootage: z
    .number()
    .int('Square footage must be a whole number')
    .min(100, 'Minimum 100 square feet')
    .max(50000, 'Maximum 50,000 square feet')
    .optional(),
    
  propertyType: z.enum(['apartment', 'house', 'condo', 'townhouse', 'studio', 'room'], {
    required_error: 'Please select a property type',
  }),
  
  leaseType: z.enum(['monthly', 'yearly', 'semester', 'short-term'], {
    required_error: 'Please select a lease type',
  }),
  
  availableDate: z
    .string()
    .min(1, 'Available date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Available date cannot be in the past'),
    
  furnished: z.boolean(),
  
  petPolicy: z.enum(['allowed', 'not-allowed', 'cats-only', 'dogs-only', 'case-by-case'], {
    required_error: 'Please select a pet policy',
  }),
  
  parking: z.enum(['none', 'street', 'garage', 'driveway', 'lot'], {
    required_error: 'Please select parking options',
  }),
  
  utilities: z.object({
    electricity: z.boolean(),
    water: z.boolean(),
    gas: z.boolean(),
    internet: z.boolean(),
    cable: z.boolean(),
    trash: z.boolean(),
  }),
  
  amenities: z.array(z.string()),
  
  nearbyFeatures: z.array(z.string()),
  
  contactPhone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number')
    .trim(),
    
  contactEmail: z
    .string()
    .email('Please enter a valid email address')
    .trim(),
    
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
    
  virtualTourUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
    
  specialInstructions: z
    .string()
    .max(500, 'Special instructions must be less than 500 characters')
    .optional(),
    
  securityDeposit: z
    .number()
    .min(0, 'Security deposit cannot be negative')
    .max(50000, 'Maximum security deposit is $50,000')
    .optional(),
    
  applicationFee: z
    .number()
    .min(0, 'Application fee cannot be negative')
    .max(1000, 'Maximum application fee is $1,000')
    .optional(),
    
  minimumLeaseTerm: z
    .number()
    .int('Lease term must be a whole number')
    .min(1, 'Minimum lease term is 1 month')
    .max(60, 'Maximum lease term is 60 months'),
    
  status: z.enum(['draft', 'active', 'pending', 'rented', 'maintenance'], {
    required_error: 'Please select a property status',
  }),
});

// Type inference
export type PropertyFormData = z.infer<typeof propertySchema>;

// Partial schema for updates
export const propertyUpdateSchema = propertySchema.partial();
export type PropertyUpdateData = z.infer<typeof propertyUpdateSchema>;

// Image upload validation
export const imageUploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed')
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      'Each image must be less than 5MB'
    )
    .refine(
      (files) => files.every((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
});

export type ImageUploadData = z.infer<typeof imageUploadSchema>;

// Search filters validation
export const propertyFiltersSchema = z.object({
  query: z.string().max(100).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().min(0).max(20).optional(),
  propertyType: z.enum(['apartment', 'house', 'condo', 'townhouse', 'studio', 'room']).optional(),
  leaseType: z.enum(['monthly', 'yearly', 'semester', 'short-term']).optional(),
  furnished: z.boolean().optional(),
  petPolicy: z.enum(['allowed', 'not-allowed', 'cats-only', 'dogs-only', 'case-by-case']).optional(),
  parking: z.enum(['none', 'street', 'garage', 'driveway', 'lot']).optional(),
  amenities: z.array(z.string()).optional(),
  location: z.string().max(200).optional(),
  availableNow: z.boolean().optional(),
  sortBy: z.enum(['price', 'date', 'bedrooms', 'bathrooms', 'location']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

export type PropertyFiltersData = z.infer<typeof propertyFiltersSchema>;

// Contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
    
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim(),
    
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number')
    .trim(),
    
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
    
  propertyId: z.string().min(1, 'Property ID is required'),
  
  tourDate: z.string().optional(),
  
  tourTime: z.string().optional(),
  
  preferredContact: z.enum(['email', 'phone', 'text']),
});

export type ContactFormData = z.infer<typeof contactFormSchema>; 