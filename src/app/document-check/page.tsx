'use client';
import DocumentCheckClient from './client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileWarning, Shield, CheckCircle } from 'lucide-react';

export default function DocumentCheckPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,97,255,0.15),transparent_60%)]" />
        <div className="relative container mx-auto px-6 pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Rejection-Proof Your Documents
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            80% of visa rejections stem from document errors. Let AI scan, verify and fortify your application before submission.
          </p>
        </div>
      </section>

      <section className="-mt-12 px-6">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: FileWarning, title: 'Error Detection', desc: 'Spot missing signatures, wrong dates and conflicts agents miss.' },
            { icon: Shield,   title: 'Fraud Prevention', desc: 'Source verifiable documents that withstand embassy scrutiny.' },
            { icon: CheckCircle, title: 'Format Compliance', desc: 'Meet the exact formatting rules of your target country.' }
          ].map((f) => (
            <Card key={f.title} className="group backdrop-blur-lg bg-white/90 border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="w-7 h-7" />
                </div>
                <CardTitle className="mt-4 text-lg">{f.title}</CardTitle>
                <CardDescription className="text-sm text-slate-600">{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-lg bg-white/90 border-white/30 shadow-xl">
            <DocumentCheckClient />
          </Card>
        </div>
      </section>
    </div>
  );
}
