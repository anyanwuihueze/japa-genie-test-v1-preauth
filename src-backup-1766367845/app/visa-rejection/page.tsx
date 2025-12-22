'use client';

import { Card } from '@/components/ui/card';

export default function VisaRejectionPage() {
  return (
    <section className="py-20 bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="p-8 bg-slate-800/50 border-slate-700">
          <h1 className="text-3xl font-bold mb-4 text-primary">Visa Rejection Reversal</h1>
          <p className="text-slate-300">
            Got a rejection letter? Don’t panic. JapaGenie specializes in structured appeals that 
            address the exact reasons for your denial — turning “no” into a second chance. 
            Learn how to boost your approval odds with tailored guidance.
          </p>
        </Card>
      </div>
    </section>
  );
}
