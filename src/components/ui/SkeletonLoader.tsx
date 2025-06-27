interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'image' | 'card';
  lines?: number;
}

export default function SkeletonLoader({ 
  className = '', 
  variant = 'text',
  lines = 1 
}: SkeletonLoaderProps) {
  if (variant === 'image') {
    return (
      <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}>
        <div className="h-48 bg-gray-300" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-6 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-300 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          } ${className}`}
        />
      ))}
    </div>
  );
} 