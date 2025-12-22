'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

const conversations = [
  {
    id: 'discovery',
    title: 'Discovery Phase',
    subtitle: 'Find your perfect visa match',
    messages: [
      { sender: 'user', text: 'Hi! I want to relocate to Canada for work. I have 5 years IT experience.' },
      { sender: 'ai', text: 'Great! Let me analyse your profile against Canadian immigration programs…' },
      { sender: 'ai', text: '✅ Express Entry: 87% chance\n✅ Provincial Nominee: 92% chance\n✅ Atlantic Immigration: 95% chance' },
    ],
  },
  {
    id: 'planning',
    title: 'Planning Phase',
    subtitle: 'Build your application roadmap',
    messages: [
      { sender: 'user', text: 'I\'ve chosen Express Entry. What documents do I need?' },
      { sender: 'ai', text: 'Here\'s your personalised checklist:\n• IELTS results (target CLB 9+)\n• Educational Credential Assessment\n• Work-experience letters\n• Police certificates' },
    ],
  },
  {
    id: 'success',
    title: 'Success Phase',
    subtitle: 'Submit with confidence',
    messages: [
      { sender: 'ai', text: '🎉 Your application is ready!\n✅ Documents verified\n✅ Forms completed\n✅ Fees: $1,325 CAD\n✅ Processing: ~6 months' },
      { sender: 'user', text: 'Thank you! Submitting now.' },
      { sender: 'ai', text: 'Best of luck! I\'ll track your status. Welcome to your new life in Canada! 🇨🇦' },
    ],
  },
];

export function HowItWorksAnimated() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setIsVisible(true), { threshold: 0.3 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const conv = conversations[demoIndex];
    const timer = setTimeout(() => {
      if (msgIndex < conv.messages.length - 1) {
        setMsgIndex((m) => m + 1);
      } else {
        setTimeout(() => {
          setDemoIndex((d) => (d + 1) % conversations.length);
          setMsgIndex(0);
        }, 1500);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isVisible, demoIndex, msgIndex]);

  const currentConv = conversations[demoIndex];
  const visibleMsgs = currentConv.messages.slice(0, msgIndex + 1);

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 rounded-full opacity-90 blur-3xl"
          style={{
            left: '50%',
            top: '30%',
            transform: 'translate(-50%, -30%)',
            animation: 'glow 15s ease-in-out infinite',
          }} 
        />
      </div>

      <style jsx>{`
        @keyframes glow {
          0%, 100% { transform: translate(-50%, -30%) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, -30%) scale(1.3); opacity: 1; }
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">See Japa Genie in Action</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">Watch how our AI guides you through every step of your visa journey</p>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-black rounded-2xl sm:rounded-[2rem] p-2 sm:p-3 shadow-xl w-full max-w-[280px] sm:max-w-[320px]">
            <div className="bg-white rounded-xl sm:rounded-[1.5rem] overflow-hidden flex flex-col h-[400px] sm:h-[34rem]">
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
                {visibleMsgs.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1 sm:py-2 text-xs ${m.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow'}`}>
                      {m.text.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < m.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                      {i === visibleMsgs.length - 1 && (
                        <span className="inline-block w-1 h-3 sm:h-4 bg-current animate-pulse ml-1" />
                      )}
                    </div>
                  </div>
                ))}
                
                {msgIndex < currentConv.messages.length - 1 && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 sm:py-2 shadow">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-3 sm:px-4 py-2 border-t bg-white">
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Type a message…" 
                    className="flex-1 bg-gray-100 rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs focus:outline-none" 
                    disabled 
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
          {conversations.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                i === demoIndex ? 'w-6 sm:w-8 bg-blue-500' : 'w-1.5 sm:w-2 bg-gray-300'
              }`} 
            />
          ))}
        </div>
        
        <div className="text-center mb-6 sm:mb-8">
          <p className="font-semibold text-sm sm:text-base">{currentConv.title}</p>
          <p className="text-xs sm:text-sm text-gray-600">{currentConv.subtitle}</p>
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" className="text-sm sm:text-base">
            <Link href="/kyc">
              Start Your Journey <Sparkles className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}