'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function EligibilityCheckSection() {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stop Applying Blindly. Check Your Eligibility First.
          </h2>
          <p className="text-lg text-gray-600">
            The average rejected visa costs <span className="font-bold text-red-600">$2,000</span>. Get honest feedback in 3 minutes.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse" style={{ animationDelay: '0s' }} />
              <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse -ml-1.5" style={{ animationDelay: '0.2s' }} />
              <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse -ml-1.5" style={{ animationDelay: '0.4s' }} />
            </div>
            <Link 
              href="/interview" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Get My Free Eligibility Report
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}