'use client';

import { Card } from '@/components/ui/card';
import { FileText, Users, Briefcase, Target, Calculator, ChevronRight } from 'lucide-react';
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
    icon: Calculator,
    title: "True Visa Cost Calculator",
    description: "See what your visa REALLY costs—all fees, POF, and hidden charges revealed.",
    details: "Calculate the complete cost including application fees, biometrics, POF requirements, and 12+ hidden costs most people miss.",
    href: "/cost-calculator",
    highlight: true,
    badge: "NEW"
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
              className={`cursor-pointer text-center p-6 h-full flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden ${
                feature.highlight 
                  ? 'bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/50 hover:border-orange-400'
                  : 'bg-slate-800/50 border-slate-700 hover:border-primary'
              }`}
            >
              {feature.highlight && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-glow pointer-events-none"></div>
                  {feature.badge && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse z-10 pointer-events-none">
                      {feature.badge}
                    </div>
                  )}
                </>
              )}

              <Link href={feature.href} className="flex flex-col flex-grow h-full">
                <div className="flex-grow">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <feature.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 mb-2">{feature.description}</p>
                  <p className="text-xs text-slate-500">{feature.details}</p>
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