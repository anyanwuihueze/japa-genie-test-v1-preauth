import { Suspense } from "react";
import EligibilityCheckClient from './client';

function EligibilityContent() {
  return (
    <div className="container py-12 space-y-8">
      <EligibilityCheckClient />
    </div>
  );
}

export default function EligibilityCheckPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading eligibility check...</div>}>
      <EligibilityContent />
    </Suspense>
  );
}
