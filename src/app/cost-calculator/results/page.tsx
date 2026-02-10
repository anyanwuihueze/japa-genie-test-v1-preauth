import { Suspense } from 'react';
import CostResultsClient from './client';  // ✅ FIXED: Import from local client file

function ResultsContent() {
  return <CostResultsClient />;
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">Loading Results...</h2>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}