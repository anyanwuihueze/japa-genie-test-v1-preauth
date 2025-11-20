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

interface UserProgress {
  overall_progress: number;
  current_stage: string;
  target_country: string;
  visa_type: string;
  profile_completed: boolean;
  documents_uploaded: boolean;
  documents_verified: boolean;
  financial_ready: boolean;
  interview_prep_done: boolean;
  application_submitted: boolean;
  decision_received: boolean;
  total_chat_messages: number;
}

interface UserProfile {
  country: string;
  destination_country: string;
  age: number;
  visa_type: string;
  profession: string;
  user_type: string;
  timeline_urgency: string;
  preferred_name?: string;
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
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // ========== ✅ FIXED: LOAD USER DATA FROM SUPABASE ==========
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      
      try {
        console.log('🔄 Loading user data from Supabase...');
        
        // Load user profile (KYC data)
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('country, destination_country, age, visa_type, profession, user_type, timeline_urgency, preferred_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          setUserName(profile.preferred_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Pathfinder');
          console.log('✅ User profile loaded:', profile);
        }

        // Load user progress
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (progress) {
          setUserProgress(progress);
          console.log('✅ User progress loaded:', progress);
        }

      } catch (error) {
        console.log('⚠ Error loading user data:', error);
      }
    }

    if (user) {
      loadUserData();
    }
  }, [user, supabase]);

  // ========== ✅ FIXED: PERSONALIZED WELCOME WITH SUPABASE DATA ==========
  useEffect(() => {
    if (user && userProfile && messages.length === 0) {
      console.log('🎯 Creating personalized welcome with Supabase data');
      
      setMessages([{ role: 'assistant', content: "🎯 Analyzing your profile for personalized visa advice..." }]);
      setIsTyping(true);

      // Enhanced context with both KYC and progress
      const enhancedContext = {
        kyc: userProfile,
        progress: userProgress
      };

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: `Provide comprehensive ${userProfile.visa_type} advice for ${userProfile.destination_country} for a ${userProfile.age}-year-old from ${userProfile.country}${userProfile.profession ? ` working as ${userProfile.profession}` : ''}. Include costs, timeline, requirements, and strategic advice. Be specific and actionable.`,
          userContext: enhancedContext,
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
          // Fallback personalized welcome
          const welcomeMessage = userProfile ? 
            `Welcome! Based on your profile:\n\n**📍 From:** ${userProfile.country}\n**🎯 Destination:** ${userProfile.destination_country}\n**📋 Visa Type:** ${userProfile.visa_type}\n**👤 Age:** ${userProfile.age}${userProfile.profession ? `\n**💼 Profession:** ${userProfile.profession}` : ''}\n\nI'm ready to provide specific advice for your ${userProfile.destination_country} ${userProfile.visa_type.toLowerCase()} journey. What would you like to know first?` :
            `Welcome, ${userName}! ✨ You have unlimited wishes.`;
          
          setMessages([{ role: 'assistant', content: welcomeMessage }]);
        }
      })
      .catch(err => {
        console.error('Chat API error:', err);
        const fallbackMessage = userProfile ? 
          `Welcome! I see you're exploring ${userProfile.visa_type} opportunities in ${userProfile.destination_country} from ${userProfile.country}. As a ${userProfile.age}-year-old${userProfile.profession ? ` ${userProfile.profession}` : ''}, you have unique opportunities. Let me help you navigate the requirements and create your success strategy!` :
          `Welcome, ${userName}! ✨ You have unlimited wishes.`;
        
        setMessages([{ role: 'assistant', content: fallbackMessage }]);
      })
      .finally(() => {
        setIsTyping(false);
      });
    }
  }, [user, userProfile, messages.length, userName]);

  // ========== LOAD EXISTING MESSAGES ==========
  useEffect(() => {
    async function loadMessages() {
      if (!user) {
        setMessages([{ role: 'assistant', content: "Welcome, Pathfinder! I'm Japa Genie. I can grant you 3 powerful wishes to map out your visa journey. What is your first wish?" }]);
        setWishCount(0);
        return;
      }
      
      setIsLoadingMessages(true);
      try {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: true });
          
        if (data && data.length > 0) {
          setMessages(data.map(msg => ({ 
            id: msg.id, 
            role: msg.role as 'user' | 'assistant', 
            content: msg.content 
          })));
          setWishCount(data.filter(m => m.role === 'user').length);
          setAiMessageCount(data.filter(m => m.role === 'assistant').length);
          setShowBanner(false);
        }
        // If no messages, the personalized welcome above will handle it
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    }

    if (!authLoading && user) {
      loadMessages();
    }
  }, [user, authLoading, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ========== ✅ ADDED: MISSING FUNCTIONS ==========
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

  const updateChatProgress = async () => {
    if (!user) return;
    
    try {
      // Fetch current progress
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('total_chat_messages')
        .eq('user_id', user.id)
        .single();

      const newCount = (currentProgress?.total_chat_messages || 0) + 1;

      // Increment by 1 instead of recounting
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          total_chat_messages: newCount,
          last_chat_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (progressError) {
        console.log('⚠️ Chat progress update failed:', progressError);
      } else {
        console.log('✅ Chat progress updated:', newCount, 'messages');
        // Refresh progress data
        const { data: updatedProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setUserProgress(updatedProgress);
      }
    } catch (error) {
      console.log('⚠️ Progress update failed (non-critical):', error);
    }
  };

  const saveInsightsToDatabase = async (insightsData: InsightOutput) => {
    if (!user || !insightsData) return;
    
    try {
      const { error } = await supabase
        .from('visa_insights')
        .insert({
          user_id: user.id,
          insight_type: 'country_comparison',
          insight_data: insightsData,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.log('⚠️ Insights save failed:', error);
      } else {
        console.log('✅ Insights saved to database');
      }
    } catch (error) {
      console.log('⚠️ Insights save failed (non-critical):', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = currentInput.trim();
    if (!trimmed || isTyping) return;

    if (showBanner) setShowBanner(false);

    const isBonusUser = user && !hasSubscription;
    if ((!user && wishCount >= MAX_WISHES) || (isBonusUser && wishCount >= 3)) {
      setMessages(prev => [...prev, { role: 'user', content: trimmed }, { role: 'assistant', content: "You've used all your wishes! Choose a plan for unlimited visa guidance." }]);
      setCurrentInput('');
      return;
    }

    const newWishCount = wishCount + 1;
    const userMessage: Message = { role: 'user', content: trimmed };
    
    if (user) {
      const savedMsg = await saveMessage('user', trimmed);
      if (savedMsg) {
        userMessage.id = savedMsg.id;
        await updateChatProgress();
      }
    }
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const headers: HeadersInit = { 'Content-Type': 'application/json' };

      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // ✅ FIXED: Use Supabase data instead of sessionStorage
      const enhancedContext = {
        kyc: userProfile,
        progress: userProgress
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          question: trimmed, 
          conversationHistory, 
          userContext: enhancedContext,
          ...(user ? {} : { wishCount: newWishCount }) 
        }),
      });

      const chatResult = await response.json();
      if (!response.ok) throw new Error(chatResult.error || 'Failed');

      let aiResponse = chatResult.answer;
      const shouldMentionName = user && (aiMessageCount % NAME_MENTION_FREQUENCY === 0);
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
      setAiMessageCount(prev => prev + 1);

      if (chatResult.insights) {
        setInsights(chatResult.insights);
        await saveInsightsToDatabase(chatResult.insights);
        
        if (window.innerWidth < 768) {
          setActiveTab('insights');
        }
      }

    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Wish ${newWishCount}: Temporary error. Please try again.` }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

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
            <div ref={messagesEndRef} />
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
                    <p>⏱️ {country.processingTimeMonths} months</p>
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