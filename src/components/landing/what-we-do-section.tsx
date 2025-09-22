'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Users, Briefcase, Video, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: FileText,
    title: "Visa Rejection Reversal",
    description: "Expert strategies to successfully appeal or reapply after a rejection.",
    details: "We analyze rejection reasons and guide you step-by-step with tailored reapplication strategies that maximize approval odds.",
    href: "#about"
  },
  {
    icon: Users,
    title: "Rejection-Proof Documents",
    description: "Guaranteed document templates and guidance to minimize refusal risk.",
    details: "From cover letters to financial statements, we provide ready-to-use templates reviewed by immigration experts.",
    href: "#about"
  },
  {
    icon: Briefcase,
    title: "Proof of Funds Guidance",
    description: "Trusted pathways to meet financial requirements without stress.",
    details: "Learn safe, verifiable methods to present proof of funds that embassies accept with confidence.",
    href: "#about"
  },
  {
    icon: Video,
    title: "Priority Processing Tips",
    description: "Insider strategies to fast-track your visa approval.",
    details: "Discover country-specific hacks, premium options, and timing strategies to cut waiting times in half.",
    href: "#about"
  }
];

export function WhatWeDoSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

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
          {features.map((feature) => {
            const isOpen = expanded === feature.title;
            return (
              <Card
                key={feature.title}
                onClick={() => setExpanded(isOpen ? null : feature.title)}
                className={`cursor-pointer text-center p-6 h-full flex flex-col group transition-all duration-300 ${
                  isOpen ? 'shadow-2xl scale-105 bg-slate-800 border-primary' : 'hover:shadow-lg hover:-translate-y-1 bg-slate-800/50 border-slate-700 hover:border-primary'
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-100">{feature.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{feature.description}</p>

                {isOpen && (
                  <div className="text-sm text-slate-300 mb-4 animate-fadeIn">
                    {feature.details}
                  </div>
                )}

                <div className="mt-auto flex justify-center items-center gap-2 text-primary group-hover:text-amber-400 transition-colors">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isOpen && (
                    <Link
                      href={feature.href}
                      className="flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Learn More
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhatWeDoSection;
