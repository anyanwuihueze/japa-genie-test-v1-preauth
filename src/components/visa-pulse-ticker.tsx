'use client';

import useVisaPulse from '@/lib/useVisaPulse';
import { Skeleton } from '@/components/ui/skeleton';

export default function VisaPulseTicker() {
  const { pulse, isLoading } = useVisaPulse();
  
  // Calculate total count from pulse data
  const pulseCount = pulse?.reduce((sum, item) => sum + (item.count || 0), 0) || 42;

  return (
    <div className="w-full bg-slate-900 border-t-2 border-amber-400 py-4 overflow-hidden shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-300 font-medium text-sm">
              {isLoading ? (
                <Skeleton className="h-4 w-16 bg-slate-700" />
              ) : (
                `Live Updates: ${pulseCount}+ visas`
              )}
            </span>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-400 text-sm">Approvals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-slate-400 text-sm">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-slate-400 text-sm">Rejections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
