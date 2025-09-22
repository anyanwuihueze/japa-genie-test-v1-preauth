'use client';

import { Card } from '@/components/ui/card';

export default function DocumentCheckPage() {
  return (
    <section className="py-20 bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="p-8 bg-slate-800/50 border-slate-700">
          <h1 className="text-3xl font-bold mb-4 text-primary">Rejection-Proof Documents</h1>
          <p className="text-slate-300">
            80% of rejections come from weak or fake documents. 
            We guide you to get real, verifiable proofs — from bank statements to flight bookings — 
            so your file passes embassy scrutiny without red flags.
          </p>
        </Card>
      </div>
    </section>
  );
}
