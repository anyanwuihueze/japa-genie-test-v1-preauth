'use client';

import { Card } from '@/components/ui/card';

export default function ProofOfFundsPage() {
  return (
    <section className="py-20 bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="p-8 bg-slate-800/50 border-slate-700">
          <h1 className="text-3xl font-bold mb-4 text-primary">Proof of Funds Support</h1>
          <p className="text-slate-300">
            Many applicants lose out because their funds don’t meet embassy standards. 
            JapaGenie shows you compliant ways to structure and present your finances — 
            giving you confidence that your proof of funds will be accepted worldwide.
          </p>
        </Card>
      </div>
    </section>
  );
}
