'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Sparkles, ArrowRight } from "lucide-react";
import VisaPulseTicker from '@/components/visa-pulse-ticker';
import { useAuth } from '@/lib/AuthContext';

export function HeroSection() {
  const [isMounted, setIsMounted] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => setIsMounted(true), []);

  return (
    <>
      <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-slate-900 text-slate-50">
        <div className="container px-4 sm:px-6 md:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className={`flex flex-col justify-center space-y-4 sm:space-y-6 transition-all duration-1000 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="space-y-3 sm:space-y-4">
                {user ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent leading-tight">
                      Welcome back!
                    </h1>
                    <p className="max-w-[600px] text-slate-300 text-base sm:text-lg md:text-xl">
                      Continue your visa journey. Check your progress or ask AI for guidance.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent leading-tight">
                      STOP Getting <span className="text-red-500">Scammed</span> by <span className="text-red-500">Fake</span> Visa Agents. START Getting Real Results.
                    </h1>
                    <p className="max-w-[600px] text-slate-300 text-base sm:text-lg md:text-xl">
                      Japa Genie is your AI-powered guide for navigating the complex world of visas. Get personalized recommendations and a clear roadmap to your destination.
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 min-[400px]:flex-row">
                {user ? (
                  <>
                    <Button
                      size="lg"
                      className="group w-full min-[400px]:w-auto bg-gradient-to-r from-amber-400 to-primary text-primary-foreground hover:shadow-lg transition-shadow rounded-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold animate-glow"
                      asChild
                    >
                      <Link href="/dashboard" className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                        <span>Go to Dashboard</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full min-[400px]:w-auto text-slate-300 hover:bg-slate-800 hover:text-slate-50 group flex items-center justify-center gap-1 px-6 py-5"
                      asChild
                    >
                      <Link href="/chat">
                        <span className="text-sm sm:text-base">Ask AI Assistant</span>
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="group w-full min-[400px]:w-auto bg-gradient-to-r from-amber-400 to-primary text-primary-foreground hover:shadow-lg transition-shadow rounded-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold animate-glow"
                      asChild
                    >
                      <Link href="/chat" className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                        <span>Start Your Journey</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full min-[400px]:w-auto text-slate-300 hover:bg-slate-800 hover:text-slate-50 group flex items-center justify-center gap-1 px-6 py-5"
                      asChild
                    >
                      <Link href="/how-it-works">
                        <span className="text-sm sm:text-base">Learn How It Works</span>
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-6 lg:mt-0">
              <div className="w-full max-w-[550px] overflow-hidden rounded-lg shadow-xl ring-1 ring-primary/50 ring-offset-4 sm:ring-offset-8 ring-offset-slate-900">
                <video 
                  src="/videos/Welcome-to-Japa-Genie.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto rounded-lg"
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