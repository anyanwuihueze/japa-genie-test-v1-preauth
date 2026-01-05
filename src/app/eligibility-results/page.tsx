import { Suspense } from 'react';
import EligibilityResultsClient from './client';
import { Loader2 } from 'lucide-react';

export default function EligibilityResultsPage() {
  return (
    <div className="container py-12">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <EligibilityResultsClient />
      </Suspense>
    </div>
  );
}