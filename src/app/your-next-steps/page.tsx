import { Suspense } from 'react';
import YourNextStepsClient from './client';

export default function YourNextStepsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    }>
      <YourNextStepsClient />
    </Suspense>
  );
}
