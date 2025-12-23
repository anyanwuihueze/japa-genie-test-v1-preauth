'use client';

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'image' | 'full';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ 
  type = 'card', 
  count = 1,
  className = '' 
}: SkeletonLoaderProps) {
  
  const skeletons = Array.from({ length: count });
  
  const getSkeletonByType = () => {
    switch(type) {
      case 'card':
        return (
          <div className="bg-gray-100 rounded-lg p-6 skeleton-shimmer">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-3 skeleton-shimmer">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        );
      
      case 'image':
        return (
          <div className="bg-gray-100 rounded-lg aspect-video skeleton-shimmer"></div>
        );
      
      case 'full':
        return (
          <div className="space-y-6 skeleton-shimmer p-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        );
    }
  };
  
  return (
    <div className={`animate-pulse ${className}`} aria-label="Loading content...">
      {skeletons.map((_, index) => (
        <div key={index} className={index > 0 ? 'mt-4' : ''}>
          {getSkeletonByType()}
        </div>
      ))}
    </div>
  );
}
