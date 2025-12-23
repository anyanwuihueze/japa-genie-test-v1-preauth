'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HowItWorksAnimated() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: 'Planning Phase',
      description: 'Build your application roadmap',
      icon: '🗺️',
    },
    {
      title: 'Document Preparation',
      description: 'Gather & verify required documents',
      icon: '📄',
    },
    {
      title: 'Submission & Follow-up',
      description: 'Submit application & track progress',
      icon: '🚀',
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 rounded-full opacity-20 blur-3xl"
          style={{
            left: '50%',
            top: '30%',
            transform: 'translate(-50%, -30%)',
            animation: 'glow 15s ease-in-out infinite',
          }}
        />
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            See Japa Genie in Action
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Watch how our AI guides you through every step of your visa journey
          </p>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-black rounded-2xl sm:rounded-[2rem] p-2 sm:p-3 shadow-xl w-full max-w-[280px] sm:max-w-[320px]">
            <div className="bg-white rounded-xl sm:rounded-[1.5rem] overflow-hidden flex flex-col h-[400px] sm:h-[34rem]">
              {/* Phone UI components remain the same */}
              <div className="flex items-center justify-between px-3 sm:px-4 py-1 sm:py-2 text-xs text-gray-500 border-b">
                <span>9:41 AM</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 border-b">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm">Japa Genie</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 space-y-2 sm:space-y-3 bg-gray-50">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1 sm:py-2 text-xs bg-blue-500 text-white rounded-br-none">
                    I've chosen Express Entry. What documents do I need?
                    <span className="inline-block w-1 h-3 sm:h-4 bg-current animate-pulse ml-1" />
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 sm:py-2 shadow">
                    <div className="flex space-x-1">
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 sm:px-4 py-2 border-t bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message…"
                    disabled
                    className="flex-1 bg-gray-100 rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs focus:outline-none"
                  />
                  <button className="p-1 sm:p-2 bg-blue-500 text-white rounded-full">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-2 mb-4 sm:mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                index === activeStep
                  ? 'w-6 sm:w-8 bg-blue-500'
                  : 'w-1.5 sm:w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <p className="font-semibold text-sm sm:text-base">
            {steps[activeStep].title}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            {steps[activeStep].description}
          </p>
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/kyc">
              Start Your Journey <Sparkles className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
