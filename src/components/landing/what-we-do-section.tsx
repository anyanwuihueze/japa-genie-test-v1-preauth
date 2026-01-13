'use client';

import { Card } from '@/components/ui/card';
import { FileText, Users, Briefcase, Target, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Target,
    title: "AI Visa Matchmaker",
    description: "Instantly discover which countries match your profile and budget.",
    details: "Our AI analyzes your qualifications to recommend the best visa pathways with highest approval rates.",
    href: "/visa-matchmaker"
  },
  {
    icon: FileText,
    title: "Visa Rejection Reversal",
    description: "Turn your rejection into approval with expert strategies.",
    details: "We analyze rejection reasons and guide you step-by-step with tailored reapplication strategies that work.",
    href: "/rejection-reversal"
  },
  {
    icon: Users,
    title: "Rejection-Proof Documents",
    description: "Guaranteed document templates and guidance to minimize refusal risk.",
    details: "From cover letters to financial statements, get ready-to-use templates reviewed by immigration experts.",
    href: "/document-check"
  },
  {
    icon: Briefcase,
    title: "Proof of Funds Guidance",
    description: "Meet financial requirements with confidence.",
    details: "Learn safe, verifiable methods to present proof of funds that embassies accept without question.",
    href: "/public-proof-of-funds"
  }
];

export function WhatWeDoSection() {
  return (
    <section className="py-12 md:py-20 bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Explore Our Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a successful visa application.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="cursor-pointer text-center p-6 h-full flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-slate-800/50 border-slate-700 hover:border-primary"
            >
              <Link href={feature.href} className="flex flex-col flex-grow h-full">
                <div className="flex-grow">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <feature.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{feature.description}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center justify-center gap-1 text-sm text-primary group-hover:text-amber-400 transition-colors font-medium">
                    <ChevronRight className="w-4 h-4 animate-chevron-pulse" style={{ animationDelay: '0s' }} />
                    <ChevronRight className="w-4 h-4 animate-chevron-pulse -ml-1" style={{ animationDelay: '0.2s' }} />
                    <span>Try This Tool</span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeDoSection;