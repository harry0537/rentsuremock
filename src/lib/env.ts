import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // App Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('RentSure'),
  
  // Database
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  MONGODB_DB: z.string().default('rentsure'),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  
  // File Upload
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  
  // External APIs
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  
  // Analytics & Monitoring
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  
  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(v => v === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING: z.string().transform(v => v === 'true').default('false'),
  NEXT_PUBLIC_MAINTENANCE_MODE: z.string().transform(v => v === 'true').default('false'),
});

// Parse and validate environment variables
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables:', error);
  throw new Error('Invalid environment configuration');
}

export { env };

// Utility functions for environment checks
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Feature flags
export const features = {
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  errorReporting: env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
  maintenanceMode: env.NEXT_PUBLIC_MAINTENANCE_MODE,
  maps: !!env.GOOGLE_MAPS_API_KEY,
  fileUpload: !!env.CLOUDINARY_CLOUD_NAME,
  email: !!env.SMTP_HOST,
  redis: !!env.UPSTASH_REDIS_REST_URL,
};

// Configuration objects
export const config = {
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    url: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: env.NODE_ENV,
  },
  database: {
    uri: env.MONGODB_URI,
    name: env.MONGODB_DB,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? parseInt(env.SMTP_PORT) : 587,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM || 'noreply@rentsure.com',
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    uploadPreset: env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  },
  google: {
    mapsApiKey: env.GOOGLE_MAPS_API_KEY,
    placesApiKey: env.GOOGLE_PLACES_API_KEY,
  },
  analytics: {
    gaId: env.NEXT_PUBLIC_GA_ID,
  },
  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    sentryAuthToken: env.SENTRY_AUTH_TOKEN,
  },
  redis: {
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  },
};

// Runtime configuration checks
export function validateRuntimeConfig() {
  const errors: string[] = [];

  // Required in production
  if (isProduction) {
    if (!env.MONGODB_URI) errors.push('MONGODB_URI is required in production');
    if (!env.NEXTAUTH_SECRET) errors.push('NEXTAUTH_SECRET is required in production');
    if (!env.NEXT_PUBLIC_APP_URL) errors.push('NEXT_PUBLIC_APP_URL is required in production');
  }

  // Warn about missing optional features
  if (!env.CLOUDINARY_CLOUD_NAME) {
    console.warn('⚠️  Cloudinary not configured - file uploads will be limited');
  }
  
  if (!env.SMTP_HOST) {
    console.warn('⚠️  SMTP not configured - email notifications disabled');
  }
  
  if (!env.GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️  Google Maps not configured - map features disabled');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }

  console.log('✅ Environment configuration validated');
  
  // Log enabled features in development
  if (isDevelopment) {
    console.log('🎯 Enabled features:', Object.entries(features)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature)
      .join(', ') || 'none'
    );
  }
} 