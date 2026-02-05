import { Suspense } from 'react';
import { TrueVisaCostCalculator } from '@/components/landing/true-visa-cost-calculator-full';

export default function CostCalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading calculator...</div>}>
      <TrueVisaCostCalculator />
    </Suspense>
  );
}
