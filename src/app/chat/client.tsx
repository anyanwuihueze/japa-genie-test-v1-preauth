'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Trash2, MessageSquare, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import CheckoutButton from '@/components/checkout-button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MAX_WISHES = 3;
const SOCIAL_PROOF_COUNT = 1200;
const NAME_MENTION_FREQUENCY = 5;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
}

interface InsightOutput {
  suggestedCountries?: Array<{
    name: string;
    visaType: string;
    estimatedCost: number;
    processingTimeMonths: number;
    pros: string[];
    cons: string[];
  }>;
  timeline?: Array<{ step: string; durationWeeks: number }>;
  alternativeStrategies?: string[];
  difficulty?: string;
  recommendations?: string[];
}

export default function UserChat() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [insights, setInsights] = useState<InsightOutput | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const [aiMessageCount, setAiMessageCount] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [userName, setUserName] = useState<string>('Pathfinder');
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // ✅ AUTO-SCROLL REF ADDED

  // ========== SUBSCRIPTION CHECK ==========
  useEffect(() => {
    async function checkUserSubscription() {
      if (!user) {
        setHasSubscription(false);
        setCheckingSubscription(false);
        return;
      }
      
      try {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
        
        setHasSubscription(!!subscription);
      } catch (error) {
        setHasSubscription(false);
      } finally {
        setCheckingSubscription(false);
      }
    }
    
    checkUserSubscription();
  }, [user, supabase]);

  // ========== ENHANCED KYC INTEGRATION ==========
  useEffect(() => {
    const storedKyc = sessionStorage.getItem('kycData');
    if (storedKyc && messages.length === 0) {
      const kycData = JSON.parse(storedKyc);
      console.log('🎯 KYC Data loaded, calling AI for personalized response:', kycData);
      
      // Clear KYC data immediately so we don't repeat
      sessionStorage.removeItem('kycData');
      
      // Set a temporary "Analyzing your profile..." message
      setMessages([{ role: 'assistant', content: "🎯 Analyzing your profile for personalized visa advice..." }]);
      setIsTyping(true);

      // Call the AI immediately with the KYC context for a robust response
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: `Provide comprehensive ${kycData.visaType} advice for ${kycData.destination} for a ${kycData.age}-year-old from ${kycData.country}${kycData.profession ? ` working as ${kycData.profession}` : ''}. Include costs, timeline, requirements, and strategic advice. Be specific and actionable.`,
          userContext: kycData,
          conversationHistory: []
        }),
      })
      .then(response => response.json())
      .then(chatResult => {
        if (chatResult.answer) {
          setMessages([{ role: 'assistant', content: chatResult.answer }]);
          if (chatResult.insights) {
            setInsights(chatResult.insights);
          }
        } else {
          // Fallback to robust welcome message
          setMessages([{ role: 'assistant', content: `Welcome! Based on your profile:\n\n**📍 From:** ${kycData.country}\n**🎯 Destination:** ${kycData.destination}\n**📋 Visa Type:** ${kycData.visaType}\n**👤 Age:** ${kycData.age}${kycData.profession ? `\n**💼 Profession:** ${kycData.profession}` : ''}\n\nI'm ready to provide specific advice for your ${kycData.destination} ${kycData.visaType.toLowerCase()} journey. What would you like to know first?` }]);
        }
      })
      .catch(err => {
        // Enhanced fallback welcome message
        setMessages([{ role: 'assistant', content: `Welcome! I see you're exploring ${kycData.visaType} opportunities in ${kycData.destination} from ${kycData.country}. As a ${kycData.age}-year-old${kycData.profession ? ` ${kycData.profession}` : ''}, you have unique opportunities. Let me help you navigate the requirements and create your success strategy!` }]);
      })
      .finally(() => {
        setIsTyping(false);
      });
    }
  }, [messages.length]);
  // ========== END ENHANCED KYC INTEGRATION ==========

  useEffect(() => {
    async function fetchUserName() {
      if (!user) return;
      try {
        const { data } = await supabase.from('user_profiles').select('preferred_name').eq('id', user.id).single();
        setUserName(data?.preferred_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Pathfinder');
      } catch (error) {
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Pathfinder');
      }
    }
    fetchUserName();
  }, [user, supabase]);

  useEffect(() => {
    async function loadMessages() {
      if (!user) {
        setMessages([{ role: 'assistant', content: "Welcome, Pathfinder! I'm Japa Genie. I can grant you 3 powerful wishes to map out your visa journey. What is your first wish?" }]);
        setWishCount(0);
        return;
      }
      setIsLoadingMessages(true);
      try {
        const { data } = await supabase.from('messages').select('*').eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: true });
        if (data && data.length > 0) {
          setMessages(data.map(msg => ({ id: msg.id, role: msg.role as 'user' | 'assistant', content: msg.content })));
          setWishCount(data.filter(m => m.role === 'user').length);
          setAiMessageCount(data.filter(m => m.role === 'assistant').length);
          setShowBanner(false);
        } else {
          setMessages([{ role: 'assistant', content: `Welcome, ${userName}! ✨ You have unlimited wishes.` }]);
        }
      } catch (error) {
        setMessages([{ role: 'assistant', content: `Welcome, ${userName}! You have unlimited wishes.` }]);
      } finally {
        setIsLoadingMessages(false);
      }
    }
    if (!authLoading && userName !== 'Pathfinder') loadMessages();
  }, [user, authLoading, userName, supabase]);

  // ✅ AUTO-SCROLL TO BOTTOM WHEN NEW MESSAGES ARRIVE
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleClearChat = async () => {
    if (!user) return;
    if (!window.confirm('Clear all chat history? This cannot be undone.')) return;
    setIsClearing(true);
    try {
      await supabase.from('messages').update({ deleted_at: new Date().toISOString() }).eq('user_id', user.id).is('deleted_at', null);
      setMessages([{ role: 'assistant', content: `Welcome back, ${userName}! ✨ You have unlimited wishes.` }]);
      setWishCount(0);
      setAiMessageCount(0);
      setInsights(null);
    } catch (error) {
      alert('Failed to clear chat.');
    } finally {
      setIsClearing(false);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!user) return null;
    try {
      const { data } = await supabase.from('messages').insert({ user_id: user.id, role, content }).select().single();
      return data;
    } catch (error) {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = currentInput.trim();
    if (!trimmed || isTyping) return;

    if (showBanner) setShowBanner(false);

    // ✅ UPDATED: Check for both anonymous users AND logged-in users without subscriptions
    const isBonusUser = user && !hasSubscription;
    if ((!user && wishCount >= MAX_WISHES) || (isBonusUser && wishCount >= 3)) {
      setMessages(prev => [...prev, { role: 'user', content: trimmed }, { role: 'assistant', content: "You've used all your wishes! Choose a plan for unlimited visa guidance." }]);
      setCurrentInput('');
      return;
    }

    const newWishCount = wishCount + 1;
    const newAiCount = aiMessageCount + 1;
    const userMessage: Message = { role: 'user', content: trimmed };
    
    if (user) {
      const savedMsg = await saveMessage('user', trimmed);
      if (savedMsg) userMessage.id = savedMsg.id;
    }
    
    setMessages(prev => newWishCount === 1 && prev.length === 1 ? [userMessage] : [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    try {
      const conversationHistory = !user ? messages.filter(m => !m.content.includes("Welcome, Pathfinder")).map(m => ({ role: m.role, content: m.content })) : [];
      const headers: HeadersInit = { 'Content-Type': 'application/json' };

      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // ========== KYC INTEGRATION IN CONVERSATION ==========
      // Get any remaining KYC data for context-aware responses
      const storedKyc = sessionStorage.getItem('kycData');
      const kycData = storedKyc ? JSON.parse(storedKyc) : null;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          question: trimmed, 
          conversationHistory, 
          userContext: kycData || undefined,
          ...(user ? {} : { wishCount: newWishCount }) 
        }),
      });
      // ========== END KYC INTEGRATION ==========

      const chatResult = await response.json();
      if (!response.ok) throw new Error(chatResult.error || 'Failed');

      let aiResponse = chatResult.answer;
      const shouldMentionName = user && (newAiCount % NAME_MENTION_FREQUENCY === 0);
      if (shouldMentionName && userName !== 'Pathfinder') {
        const greetings = [`Great question, ${userName}!`, `${userName}, here's what you need to know:`];
        aiResponse = `${greetings[Math.floor(Math.random() * greetings.length)]} ${aiResponse}`;
      }

      const assistantMessage: Message = { role: 'assistant', content: aiResponse };
      if (user) {
        const savedMsg = await saveMessage('assistant', aiResponse);
        if (savedMsg) assistantMessage.id = savedMsg.id;
      }
      
      setMessages(prev => [...prev, assistantMessage]);
      setWishCount(newWishCount);
      setAiMessageCount(newAiCount);

      if (chatResult.insights) {
        setInsights(chatResult.insights);
        // Auto-switch to insights tab on mobile when new insights arrive
        if (window.innerWidth < 768) {
          setActiveTab('insights');
        }
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Wish ${newWishCount}: Temporary error. Trusted by ${SOCIAL_PROOF_COUNT}+ professionals — Sign up` }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

  // ✅ UPDATED: Calculate wishes left based on user type
  const isBonusUser = user && !hasSubscription;
  const wishesLeft = hasSubscription ? Infinity : (isBonusUser ? Math.max(0, 3 - wishCount) : Math.max(0, MAX_WISHES - wishCount));

  if (authLoading || isLoadingMessages || checkingSubscription) {
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
      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Insights
          {insights?.suggestedCountries?.length ? (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          ) : null}
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div className={`${activeTab === 'chat' ? 'flex' : 'hidden'} md:flex w-full md:w-1/2 flex-col border-r border-gray-200 bg-white`}>
          {showBanner && !user && messages.length <= 1 && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="max-w-2xl mx-auto">
                <h3 className="font-semibold text-sm sm:text-base mb-2 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />Make Your 3 Wishes Count!
                </h3>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>✅ Where you're from (e.g., Lagos, Nigeria)</li>
                  <li>✅ Where you want to go (e.g., Canada, UK)</li>
                  <li>✅ Your visa type (Study, Work, Visit)</li>
                </ul>
              </div>
            </div>
          )}

          <div className="bg-blue-50 py-1.5 px-3 sm:px-4 text-center text-xs text-blue-700 font-medium flex items-center justify-between">
            <span className="truncate">Trusted by {SOCIAL_PROOF_COUNT}+ professionals</span>
            {user && messages.length > 1 && (
              <Button variant="ghost" size="sm" onClick={handleClearChat} disabled={isClearing} className="h-6 px-2 text-xs shrink-0 ml-2">
                <Trash2 className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">{isClearing ? 'Clearing...' : 'Clear'}</span>
              </Button>
            )}
          </div>

          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 sm:space-y-3">
            {messages.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base break-words ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none shadow'}`}>
                  {msg.role === 'assistant' ? <div className="prose prose-sm max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown></div> : msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* ✅ AUTO-SCROLL ANCHOR ADDED */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg px-3 sm:px-4 py-2 shadow">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 sm:p-4 border-t bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <Badge variant={wishesLeft > 0 ? "default" : "secondary"} className="text-xs">
                {hasSubscription ? '✨ Unlimited wishes' : wishesLeft > 0 ? `${wishesLeft} wish${wishesLeft !== 1 ? 'es' : ''} left` : 'All wishes used'}
              </Badge>
              <div className="text-xs text-gray-500">
                {hasSubscription ? `Wish ${wishCount}` : `Wish ${wishCount} of ${isBonusUser ? 3 : MAX_WISHES}`}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input 
                ref={inputRef} 
                type="text" 
                value={currentInput} 
                onChange={(e) => setCurrentInput(e.target.value)} 
                placeholder={hasSubscription ? "Ask your next wish..." : "Ask for your first wish..."} 
                className="flex-1 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                disabled={isTyping || ((!user && wishCount >= MAX_WISHES) || (isBonusUser && wishCount >= 3))} 
              />
              <button 
                type="submit" 
                disabled={isTyping || !currentInput.trim() || ((!user && wishCount >= MAX_WISHES) || (isBonusUser && wishCount >= 3))} 
                className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg text-sm whitespace-nowrap min-w-[60px]"
              >
                {isTyping ? '...' : 'Send'}
              </button>
            </form>
            {/* ✅ UPDATED: Show pricing CTA for both anonymous AND bonus users */}
            {((!user && wishCount >= MAX_WISHES) || (isBonusUser && wishCount >= 3)) ? (
              <div className="mt-3">
                <Button 
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Choose Plan for Unlimited Access
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Insights Panel */}
        <div className={`${activeTab === 'insights' ? 'flex' : 'hidden'} md:flex w-full md:w-1/2 bg-gradient-to-b from-blue-50 to-purple-50 p-3 sm:p-4 md:p-6 overflow-y-auto flex-col`}>
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">AI Insights</h3>
          </div>

          {isTyping ? (
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          ) : insights?.suggestedCountries?.length ? (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Country Comparison</h4>
                <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow">
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={insights.suggestedCountries.map(c => ({ name: c.name, Cost: c.estimatedCost, Time: c.processingTimeMonths }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="Cost" fill="#8884d8" name="Cost (USD)" />
                      <Bar yAxisId="right" dataKey="Time" fill="#82ca9d" name="Months" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {insights.suggestedCountries.map((country, idx) => (
                <div key={idx} className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow space-y-2">
                  <h4 className="font-bold text-sm sm:text-base">{country.name}</h4>
                  <p className="text-sm sm:text-base text-blue-600">{country.visaType}</p>
                  <div className="text-xs text-gray-600">
                    <p>💰 ${country.estimatedCost.toLocaleString()}</p>
                    <p>⏱️ ${country.processingTimeMonths} months</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-700">Pros:</p>
                    <ul className="text-xs space-y-1">
                      {country.pros.map((p, i) => (
                        <li key={i} className="flex gap-1">
                          <span className="text-green-500 shrink-0">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-700">Cons:</p>
                    <ul className="text-xs space-y-1">
                      {country.cons.map((c, i) => (
                        <li key={i} className="flex gap-1">
                          <span className="text-red-500 shrink-0">✗</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              {insights.timeline && insights.timeline.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Timeline</h4>
                  {insights.timeline.map((step, idx) => (
                    <div key={idx} className="flex gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm sm:text-base shrink-0">{idx + 1}</div>
                      <div className="flex-1 bg-white p-2 sm:p-3 rounded-lg shadow">
                        <p className="text-sm sm:text-base font-medium">{step.step}</p>
                        <p className="text-xs text-gray-500">~{step.durationWeeks} weeks</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {insights.alternativeStrategies && insights.alternativeStrategies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Alternative Strategies</h4>
                  {insights.alternativeStrategies.map((strategy, idx) => (
                    <div key={idx} className="flex gap-2 bg-yellow-50 p-2 sm:p-3 rounded-lg">
                      <span className="text-yellow-500 shrink-0">💡</span>
                      <span className="text-sm sm:text-base">{strategy}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mx-auto text-gray-300 mb-2 sm:mb-3" />
              <p className="text-gray-500 text-sm sm:text-base px-4">Ask a visa-related question to see insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}