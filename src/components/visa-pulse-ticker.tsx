'use client';

import useVisaPulse from '@/lib/useVisaPulse';
import { Skeleton } from '@/components/ui/skeleton';

export default function VisaPulseTicker() {
  const { pulse, isLoading } = useVisaPulse();
  
  const pulseCount = pulse?.reduce((sum, item) => sum + (item.count || 0), 0) || 42;

  // Get ticker items - show headline or count+headline
  const tickerItems = pulse && pulse.length > 0 
    ? pulse.map(item => {
        const count = item.count ? `${item.count}+ ` : '';
        return `${count}${item.headline || 'Visa Update'}`;
      })
    : [
        `🚀 ${pulseCount}+ Visas Processed`,
        "✅ Canada Express Entry: 85% Success",
        "��🇪 Germany Job Seeker: 72% Match", 
        "🇬🇧 UK Skilled Worker: 3-Week Processing",
        "�� Stop Guessing, Know Your Eligibility",
        "📈 2,000+ Users Found Their Match"
      ];

  return (
    <div className="w-full bg-slate-900 border-t-2 border-amber-400 py-4 overflow-hidden shadow-lg">
      {/* Scrolling ticker container */}
      <div className="ticker-container">
        <div className="animate-ticker flex whitespace-nowrap">
          {/* Duplicate content for seamless loop */}
          {[...tickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center mx-6">
              <span className="text-slate-300 text-sm font-medium">{item}</span>
              <div className="ml-6 w-1 h-1 bg-amber-400 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Static info at bottom */}
      <div className="container mx-auto px-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm">Live Updates</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
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
