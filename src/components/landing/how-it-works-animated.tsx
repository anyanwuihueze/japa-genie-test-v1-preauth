'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

/* ----------  data  ---------- */
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
      { sender: 'user', text: 'I’ve chosen Express Entry. What documents do I need?' },
      { sender: 'ai', text: 'Here’s your personalised checklist:\n• IELTS results (target CLB 9+)\n• Educational Credential Assessment\n• Work-experience letters\n• Police certificates' },
    ],
  },
  {
    id: 'success',
    title: 'Success Phase',
    subtitle: 'Submit with confidence',
    messages: [
      { sender: 'ai', text: '🎉 Your application is ready!\n✅ Documents verified\n✅ Forms completed\n✅ Fees: $1,325 CAD\n✅ Processing: ~6 months' },
      { sender: 'user', text: 'Thank you! Submitting now.' },
      { sender: 'ai', text: 'Best of luck! I’ll track your status. Welcome to your new life in Canada! 🇨🇦' },
    ],
  },
];

export function HowItWorksAnimated() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
    <section ref={sectionRef} className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      
      {/* === BEAUTIFUL FLOATING ORBS BACKGROUND === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orb 1 - Large, top-left */}
        <div 
          className="absolute w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-100 rounded-full opacity-40 blur-xl"
          style={{
            left: '10%',
            top: '20%',
            animation: 'floatUp 20s ease-in-out infinite',
          }}
        />
        
        {/* Orb 2 - Medium, center-right */}
        <div 
          className="absolute w-24 h-24 bg-gradient-to-r from-blue-100 to-teal-50 rounded-full opacity-50 blur-xl"
          style={{
            right: '15%',
            top: '50%',
            animation: 'floatUp 25s ease-in-out infinite reverse',
          }}
        />
        
        {/* Orb 3 - Small, bottom-left */}
        <div 
          className="absolute w-16 h-16 bg-gradient-to-r from-cyan-100 to-blue-50 rounded-full opacity-60 blur-xl"
          style={{
            left: '20%',
            bottom: '10%',
            animation: 'floatUp 18s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">See Japa Genie in Action</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Watch how our AI guides you through every step of your visa journey
          </p>
        </div>

        {/* Phone Mockup */}
        <div className="flex justify-center mb-8">
          <div className="bg-black rounded-[2rem] p-3 shadow-xl w-80">
            <div className="bg-white rounded-[1.5rem] overflow-hidden flex flex-col h-[34rem]">
              {/* Status Bar */}
              <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500 border-b">
                <span>9:41 AM</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                </div>
              </div>

              {/* Chat Header */}
              <div className="flex items-center space-x-3 px-4 py-3 border-b">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Japa Genie</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                {visibleMsgs.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        m.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow'
                      }`}
                    >
                      {m.text.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < m.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                      {i === visibleMsgs.length - 1 && (
                        <span className="inline-block w-1 h-4 bg-current animate-pulse ml-1" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {msgIndex < currentConv.messages.length - 1 && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl px-3 py-2 shadow">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Field */}
              <div className="px-4 py-3 border-t bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message…"
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
                    disabled
                  />
                  <button className="p-2 bg-blue-500 text-white rounded-full">
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          {conversations.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === demoIndex ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="font-semibold">{currentConv.title}</p>
          <p className="text-sm text-gray-600">{currentConv.subtitle}</p>
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/chat">
              Start Your Journey <Sparkles className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* === ANIMATION KEYFRAMES === */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100px);
          }
        }
      `}</style>
    </section>
  );
}

export default HowItWorksAnimated;