'use client';

import { Card } from '@/components/ui/card';
import { FileText, Users, Briefcase, Video } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: FileText,
    title: "Visa Rejection Reversal",
    description: "Expert strategies to successfully appeal or reapply after a rejection.",
    details: "We analyze rejection reasons and guide you step-by-step with tailored reapplication strategies that maximize approval odds.",
    href: "/rejection-reversal"
  },
  {
    icon: Users,
    title: "Rejection-Proof Documents",
    description: "Guaranteed document templates and guidance to minimize refusal risk.",
    details: "From cover letters to financial statements, we provide ready-to-use templates reviewed by immigration experts.",
    href: "/document-check"
  },
  {
    icon: Briefcase,
    title: "Proof of Funds Guidance",
    description: "Trusted pathways to meet financial requirements without stress.",
    details: "Learn safe, verifiable methods to present proof of funds that embassies accept with confidence.",
    href: "/proof-of-funds"
  },
  {
    icon: Video,
    title: "Priority Processing Tips",
    description: "Insider strategies to fast-track your visa approval.",
    details: "Discover country-specific hacks, premium options, and timing strategies to cut waiting times in half.",
    href: "/priority-processing"
  }
];

export function WhatWeDoSection() {
  return (
    <section className="py-12 md:py-20 bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            What We Do
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your complete toolkit for a successful visa application.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link 
              key={feature.title}
              href={feature.href}
              className="block h-full group"
            >
              <Card className="cursor-pointer text-center p-6 h-full flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-slate-800/50 border-slate-700 hover:border-primary">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 mb-4 flex-grow">{feature.description}</p>
                
                <div className="mt-auto">
                  <div className="text-sm text-primary group-hover:text-amber-400 transition-colors font-medium">
                    Learn More →
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeDoSection;