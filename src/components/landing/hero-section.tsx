'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 text-slate-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className={`flex flex-col justify-center space-y-6 transition-all duration-1000 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent">
                STOP Getting <span className="text-red-500">Scammed</span> by <span className="text-red-500">Fake</span> Visa Agents. START Getting Real Results.
              </h1>
              <p className="max-w-[600px] text-slate-300 md:text-xl">
                Japa Genie is your AI-powered guide for navigating the complex world of visas. Get personalized recommendations and a clear roadmap to your destination.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button
                size="lg"
                className="group w-full sm:w-auto bg-gradient-to-r from-amber-400 to-primary text-primary-foreground hover:shadow-lg transition-shadow rounded-full px-8 py-6 text-lg font-bold animate-glow"
                asChild
              >
                <Link href="/chat" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span>Start Your Journey</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-slate-300 hover:bg-slate-800 hover:text-slate-50 group flex items-center gap-1"
                asChild
              >
                <Link href="/how-it-works">
                  Learn How It Works
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="overflow-hidden rounded-lg shadow-xl ring-1 ring-primary/50 ring-offset-8 ring-offset-slate-900">
              <video 
                src="/videos/Welcome-to-Japa-Genie.mp4" 
                autoPlay
                loop
                muted
                playsInline
                className="rounded-lg"
                width="550"
                height="310"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
