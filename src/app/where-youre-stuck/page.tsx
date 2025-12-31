'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stuckPoints = [
  {
    title: "Your visa got denied",
    description: "AI analyzes your rejection letter in 90 seconds to identify the exact reasons. For complex appeals, connect with immigration lawyers who specialize in reversals.",
    emoji: "💔",
    cta: "Analyze my rejection",
    mobileCta: "Rejection Analysis",
    path: "/rejection-reversal",
  },
  {
    title: "You're overwhelmed by documents",
    description: "AI scans your documents for common red flags and missing items. Upgrade to document verification with immigration specialists if needed.",
    emoji: "📑",
    cta: "Check my documents",
    mobileCta: "Document Check",
    path: "/document-check",
  },
  {
    title: "You don't know which country to choose",
    description: "Our AI matchmaker analyzes your profile and recommends countries with the highest approval odds for someone like you.",
    emoji: "🌍",
    cta: "Help me choose a country",
    mobileCta: "Country Match",
    path: "/visa-matchmaker",
  },
  {
    title: "You need step-by-step guidance",
    description: "Get a personalized roadmap with daily tasks, document checklists, and deadline reminders tailored to your specific visa type.",
    emoji: "🗺️",
    cta: "Guide me step-by-step",
    mobileCta: "Step-by-Step Guide",
    path: "/kyc",
  },
];

export default function WhereYoureStuck() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Where are you stuck?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pick your biggest challenge. We'll show you exactly how Japa Genie can help.
          </p>
        </div>

        {/* Stuck Points Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {stuckPoints.map((point, index) => (
            <Card 
              key={index}
              className="mobile-card-btn cursor-pointer p-6 rounded-xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <Link href={point.path} className="block h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl flex-shrink-0">{point.emoji}</div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      {point.description}
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full mobile-btn-fix bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  <span className="hidden sm:inline">{point.cta}</span>
                  <span className="sm:hidden">{point.mobileCta}</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Card className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 border-0">
            <div className="p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Still not sure where to start?</h3>
              <p className="mb-4">Take our 2-minute visa assessment</p>
              <Button 
                asChild 
                className="bg-white text-amber-600 hover:bg-amber-50 mobile-btn-fix"
                size="lg"
              >
                <Link href="/visa-readiness-check">
                  Start Assessment
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
