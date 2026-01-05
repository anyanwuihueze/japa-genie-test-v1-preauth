
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Trash2, MessageSquare, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MAX_WISHES = 3;
const SOCIAL_PROOF_COUNT = 1200;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
}

interface InsightOutput {
  suggestedCountries?: Array<{ name: string; visaType: string; estimatedCost: number; processingTimeMonths: number; pros: string[]; cons: string[]; }>;
  timeline?: Array<{ step: string; durationWeeks: number }>;
  alternativeStrategies?: string[];
  difficulty?: string;
  recommendations?: string[];
}

interface KYCData {
    country: string;
    destination: string;
    age: string;
    visaType: string;
    profession?: string;
    userType?: string;
    timelineUrgency?: string;
}

// ✅ FIX: Add prop to receive initial KYC data
export default function UserChat({ initialKycData }: { initialKycData?: KYCData | null }) {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [insights, setInsights] = useState<InsightOutput | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [userName, setUserName] = useState<string>('Pathfinder');
  
  // ✅ FIX: This state now holds the definitive KYC data for the session
  const [sessionKyc, setSessionKyc] = useState<KYCData | null | undefined>(initialKycData);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // ✅ FIX: Logic to load KYC data from various sources on initial load
    const loadData = async () => {
        setIsLoadingMessages(true);
        let kycDataToUse = initialKycData;

        // If no data from props, check sessionStorage (for refresh)
        if (!kycDataToUse) {
            const storedKyc = sessionStorage.getItem('kycData');
            if (storedKyc) {
                try {
                    kycDataToUse = JSON.parse(storedKyc);
                    console.log('✅ KYC data loaded from sessionStorage');
                } catch (e) {
                    console.error('Failed to parse KYC data from sessionStorage');
                }
            }
        }
        
        setSessionKyc(kycDataToUse);

        let welcomeMessage = "Welcome to Japa Genie! How can I help with your visa journey today?";
        if (kycDataToUse) {
            welcomeMessage = `Hello! Based on your profile (moving from ${kycDataToUse.country} to ${kycDataToUse.destination}), I'm ready to help. What's your first question?`;
        }
        
        if (user) {
            const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
            if (profile) {
                setUserName(profile.preferred_name || profile.email?.split('@')[0] || 'Pathfinder');
                if (profile.destination_country) {
                    welcomeMessage = `Welcome back, ${profile.preferred_name || 'friend'}! Ready to continue planning your journey to ${profile.destination_country}?`;
                }
            }
            const { data: existingMessages } = await supabase.from('messages').select('*').eq('user_id', user.id).is('deleted_at', null).order('created_at');
            if (existingMessages && existingMessages.length > 0) {
                 setMessages(existingMessages.map(m => ({ role: m.role, content: m.content, id: m.id })));
            } else {
                 setMessages([{ role: 'assistant', content: welcomeMessage, id: 'initial-welcome' }]);
            }
        } else {
            setMessages([{ role: 'assistant', content: welcomeMessage, id: 'initial-welcome' }]);
        }
        setIsLoadingMessages(false);
    };

    if (!authLoading) {
        loadData();
    }
  }, [user, authLoading, initialKycData, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = currentInput.trim();
    if (!trimmedInput || isTyping) return;

    const newUserMessage: Message = { role: 'user', content: trimmedInput, id: Date.now().toString() };
    setMessages(prev => [...prev, newUserMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // ✅ FIX: Construct userContext from the reliable sessionKyc state
    const userContext = sessionKyc ? {
        country: sessionKyc.country,
        destination: sessionKyc.destination,
        age: parseInt(sessionKyc.age) || undefined,
        visaType: sessionKyc.visaType,
        profession: sessionKyc.profession,
        userType: sessionKyc.userType,
        timelineUrgency: sessionKyc.timelineUrgency
    } : {};
    
    console.log('🚀 Sending to API with context:', userContext);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmedInput,
          conversationHistory: messages,
          userContext,
          isSignedIn: !!user
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const result = await response.json();
      const aiResponse: Message = { role: 'assistant', content: result.answer, id: Date.now().toString() + 'ai' };
      setMessages(prev => [...prev, aiResponse]);
      
      if(result.insights) {
        setInsights(result.insights);
      }

    } catch (error) {
      const errorResponse: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', id: 'error-msg' };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isLoadingMessages) {
      return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md px-4 py-2 rounded-lg text-sm break-words ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none shadow'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
            </div>
            ))}
            {isTyping && (
            <div className="flex justify-start">
                <div className="bg-white border rounded-lg px-4 py-2 shadow">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                </div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white/80 backdrop-blur">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input 
                type="text" 
                value={currentInput} 
                onChange={(e) => setCurrentInput(e.target.value)} 
                placeholder="Ask your question..." 
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                disabled={isTyping}
            />
            <button 
                type="submit" 
                disabled={isTyping || !currentInput.trim()} 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg"
            >
                {isTyping ? '...' : 'Send'}
            </button>
            </form>
        </div>
    </div>
  );
}
