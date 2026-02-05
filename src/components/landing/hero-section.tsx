'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import VisaPulseTicker from '@/components/visa-pulse-ticker';
import { useAuth } from '@/lib/AuthContext';

export function HeroSection() {
  const [isMounted, setIsMounted] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => setIsMounted(true), []);

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 text-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-24 items-center">
            {/* Left Column - Text Content */}
            <div className={`flex flex-col justify-center transition-all duration-1000 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Title and Description */}
              <div className="space-y-6 mb-8">
                {user ? (
                  <>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent leading-tight">
                      Welcome back!
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-[600px]">
                      Continue your visa journey. Check your progress or ask AI for guidance.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                      <span className="text-slate-50">STOP Getting </span>
                      <span className="text-red-500">Scammed</span>
                      <span className="text-slate-50"> by </span>
                      <span className="text-red-500">Fake</span>
                      <span className="text-slate-50"> Visa Agents. </span>
                      <br className="hidden sm:block" />
                      <span className="text-slate-50">START Getting </span>
                      <span className="text-yellow-400">Real Results.</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-[600px]">
                      Japa Genie is your AI-powered guide for navigating the complex world of visas. Get personalized recommendations and a clear roadmap to your destination.
                    </p>
                  </>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Primary Button with Chevrons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse" style={{ animationDelay: '0s' }} />
                    <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse -ml-2" style={{ animationDelay: '0.2s' }} />
                    <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse -ml-2" style={{ animationDelay: '0.4s' }} />
                  </div>
                  
                  {user ? (
                    <Button
                      size="lg"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 rounded-full"
                      asChild
                    >
                      <Link href="/dashboard" className="flex items-center justify-center gap-2 px-8 py-6 whitespace-nowrap">
                        <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform flex-shrink-0" />
                        <span className="text-lg font-bold">Go to Dashboard</span>
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 rounded-full"
                      asChild
                    >
                      <Link href="/kyc" className="flex items-center justify-center gap-2 px-8 py-6 whitespace-nowrap">
                        <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform flex-shrink-0" />
                        <span className="text-lg font-bold">Start Your Journey</span>
                      </Link>
                    </Button>
                  )}
                </div>
                
                {/* Secondary Button */}
                {user ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-slate-300 bg-transparent hover:bg-slate-800 hover:text-white border-2 border-slate-600 hover:border-slate-500 group rounded-full flex-shrink-0"
                    asChild
                  >
                    <Link href="/chat" className="flex items-center justify-center gap-2 px-6 py-6 whitespace-nowrap">
                      <span className="text-base">Ask AI</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-slate-300 bg-transparent hover:bg-slate-800 hover:text-white border-2 border-slate-600 hover:border-slate-500 group rounded-full flex-shrink-0"
                    asChild
                  >
                    <Link href="/how-it-works" className="flex items-center justify-center gap-2 px-6 py-6 whitespace-nowrap">
                      <span className="text-base">Learn More</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column - Video */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[600px] overflow-hidden rounded-xl shadow-2xl ring-2 ring-primary/30 ring-offset-4 ring-offset-slate-900">
                <video 
                  src="/videos/Welcome-to-Japa-Genie.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VisaPulseTicker />
    </>
  );
}