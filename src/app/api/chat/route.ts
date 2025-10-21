'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/AuthContext';
import CheckoutButton from '@/components/checkout-button';
import { createClient } from '@/lib/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  created_at?: string;
}

interface InsightOutput {
  category: string;
  confidence: number;
  recommendations?: string[];
  timeline?: string;
  difficulty?: string;
}

const SOCIAL_PROOF_COUNT = 1200;

export default function UserChat() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [insights, setInsights] = useState<InsightOutput | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    tier: string;
    questionsUsed: number;
    questionsLimit: number;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    async function loadMessages() {
      if (!user) {
        setMessages([{
          role: 'assistant',
          content: "Welcome, Pathfinder! I'm Japa Genie. Sign in for 3 free wishes to start your visa journey.",
        }]);
        setSubscriptionInfo(null);
        return;
      }

      setIsLoadingMessages(true);
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setSubscriptionInfo({
            tier: profile.subscription_tier,
            questionsUsed: profile.wishes_used,
            questionsLimit: profile.wishes_limit,
          });
        }

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages(data?.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          created_at: msg.created_at,
        })) || [{
          role: 'assistant',
          content: profile?.subscription_tier === 'premium'
            ? "Welcome back, Premium user! Unlimited wishes await."
            : "Welcome back! You have 3 free wishes.",
        }]);
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([{
          role: 'assistant',
          content: "Welcome back! Let's continue your visa journey.",
        }]);
      } finally {
        setIsLoadingMessages(false);
      }
    }

    if (!authLoading) loadMessages();
  }, [user, authLoading, supabase]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => (prev.some(m => m.id === newMessage.id) ? prev : [...prev, newMessage]));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, supabase]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCtaClick = () => {
    alert("Redirecting to checkout for premium upgrade...");
  };

  const renderMessageContent = (content: string) => (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{
        __html: content
          .replace(/(Sign up|Unlock your step-by-step plan|See your .* timeline|Get your .* checklist)/g,
            '<span class="text-blue-600 font-medium cursor-pointer hover:underline">$1</span>')
          .replace(/(⚠️ Limited-time: .* sign up now)/g,
            '<span class="text-red-600 font-medium cursor-pointer hover:underline">$1</span>'),
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.cursor-pointer')) handleCtaClick();
      }}
    />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = currentInput.trim();
    if (!trimmed || isTyping || !user) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed, id: `temp-${Date.now()}` }]);
    setCurrentInput('');
    setIsTyping(true);
    setIsInsightsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, wishCount: subscriptionInfo?.questionsUsed + 1 || 1 }),
      });

      const chatResult = await response.json();

      if (!response.ok) {
        if (chatResult.needsAuth) throw new Error('NEED_AUTH');
        if (chatResult.needsUpgrade) throw new Error('NEED_UPGRADE');
        throw new Error(chatResult.error || 'Failed to get response');
      }

      const { answer, userMessageId, assistantMessageId, questionsUsed, questionsLimit, questionsRemaining } = chatResult;
      setSubscriptionInfo(prev => ({
        tier: prev?.tier || 'free',
        questionsUsed,
        questionsLimit,
      }));

      setMessages(prev => {
        const withoutOptimistic = prev.filter(m => !m.id?.startsWith('temp-'));
        return [
          ...withoutOptimistic,
          { role: 'user', content: trimmed, id: userMessageId },
          { role: 'assistant', content: answer, id: assistantMessageId },
        ];
      });

      if (isVisaRelated(trimmed)) {
        const insightsResponse = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: trimmed, aiResponse: answer }),
        });
        if (insightsResponse.ok) setInsights(await insightsResponse.json());
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages(prev => prev.filter(m => !m.id?.startsWith('temp-')).concat({
        role: 'assistant',
        content: err.message === 'NEED_UPGRADE'
          ? `You've reached your ${subscriptionInfo?.questionsLimit || 3} free wishes! Upgrade to premium.`
          : `Wish error. Trusted by ${SOCIAL_PROOF_COUNT}+ professionals — Sign up`,
      }));
    } finally {
      setIsTyping(false);
      setIsInsightsLoading(false);
    }
  };

  const isVisaRelated = (text: string) => {
    const lower = text.toLowerCase();
    const countries = ['canada', 'australia', 'usa', 'uk', 'spain', 'germany', 'france', 'italy', 'netherlands'];
    const visaKeywords = ['visa', 'immigration', 'relocate', 'move to', 'work in', 'study in'];
    return countries.some(c => lower.includes(c)) || visaKeywords.some(k => lower.includes(k));
  };

  const wishesLeft = subscriptionInfo?.tier === 'premium'
    ? Infinity
    : Math.max(0, (subscriptionInfo?.questionsLimit || 3) - (subscriptionInfo?.questionsUsed || 0));

  const getWishText = () => {
    if (subscriptionInfo?.tier === 'premium') return '✨ Unlimited wishes';
    return wishesLeft > 0 ? `${wishesLeft} wish${wishesLeft !== 1 ? 'es' : ''} left` : 'All wishes used';
  };

  if (authLoading || isLoadingMessages) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-4rem)]">
      <div className="flex flex-col border-r border-gray-200 relative bg-white">
        <div className="bg-blue-50 py-1.5 px-4 text-center text-xs text-blue-700 font-medium flex items-center justify-center gap-2">
          <Zap className="w-3 h-3" />
          Trusted by {SOCIAL_PROOF_COUNT}+ professionals — average approval path uncovered in 7 days
          {user && subscriptionInfo && (
            <Badge variant={subscriptionInfo.tier === 'premium' ? 'default' : 'outline'} className="ml-2 text-xs">
              {subscriptionInfo.tier === 'premium' ? '⭐ Premium' : 'Free'}
            </Badge>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 relative z-10">
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-lg text-sm ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none shadow'
              }`}>
                {msg.content.includes('Wish') ? renderMessageContent(msg.content) : msg.content}
                {msg.created_at && (
                  <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg px-4 py-2 rounded-bl-none shadow">
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

        <div className="p-4 border-t bg-white/80 backdrop-blur relative z-10">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={wishesLeft > 0 ? 'default' : 'secondary'}>{getWishText()}</Badge>
            <div className="text-xs text-gray-500">
              {user ? `Wish ${subscriptionInfo?.questionsUsed || 0} of ${subscriptionInfo?.questionsLimit || 3}` : `Wish ${messages.filter(m => m.role === 'user').length} of 3`}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={wishesLeft <= 0 ? 'Upgrade for more questions' : `Ask your next wish... (${wishesLeft} left)`}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping || wishesLeft <= 0 || !user}
            />
            <button
              type="submit"
              disabled={isTyping || !currentInput.trim() || wishesLeft <= 0 || !user}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {isTyping ? '...' : wishesLeft <= 0 ? 'Upgrade' : 'Send'}
            </button>
          </form>

          {wishesLeft <= 2 && wishesLeft > 0 && user && (
            <div className="mt-2 text-xs text-orange-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {wishesLeft === 1 ? 'Last wish remaining!' : `${wishesLeft} wishes remaining`} - Upgrade for unlimited
            </div>
          )}
          {wishesLeft <= 0 && user && <div className="mt-3"><CheckoutButton /></div>}
        </div>
      </div>

      <div className="bg-gradient-to-b from-blue-50 to-purple-50 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
        </div>
        {isInsightsLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ) : insights ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Difficulty</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                insights.difficulty === 'High' ? 'bg-red-100 text-red-800' :
                insights.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>{insights.difficulty || 'Medium'}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Expected Timeline</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-600" style={{
                  width: insights.timeline?.includes('1–3') ? '25%' :
                         insights.timeline?.includes('4–6') ? '50%' :
                         insights.timeline?.includes('6–12') ? '75%' : '100%'
                }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{insights.timeline || 'Varies'}</p>
            </div>
            {insights.recommendations?.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Key Recommendations</p>
                <ul className="space-y-1.5">
                  {insights.recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={idx} className="text-sm flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span className="leading-tight">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Ask a visa-related question to see AI-powered insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}