'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import CheckoutButton from '@/components/checkout-button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
}

interface InsightOutput {
  category: string;
  confidence: number;
  recommendations?: string[];
  timeline?: string;
  difficulty?: string;
}

const MAX_WISHES = 3;
const SOCIAL_PROOF_COUNT = 1200;
const NAME_MENTION_FREQUENCY = 5; // Mention name every 5 AI messages

export default function UserChat() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [insights, setInsights] = useState<InsightOutput | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const [aiMessageCount, setAiMessageCount] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [userName, setUserName] = useState<string>('Pathfinder');
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch user's preferred name
  useEffect(() => {
    async function fetchUserName() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('preferred_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Priority: preferred_name → OAuth name → email username → generic
        const name = 
          data?.preferred_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Pathfinder';

        setUserName(name);
      } catch (error) {
        console.error('Error fetching user name:', error);
        // Fallback
        const name = 
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Pathfinder';
        setUserName(name);
      }
    }

    fetchUserName();
  }, [user, supabase]);

  useEffect(() => {
    async function loadMessages() {
      if (!user) {
        setMessages([{
          role: 'assistant',
          content: "Welcome, Pathfinder! I'm Japa Genie, your magical guide to global relocation. I can grant you 3 powerful wishes to map out your visa journey. What is your first wish?",
        }]);
        setWishCount(0);
        return;
      }
      
      setIsLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setMessages(data.map(msg => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })));
          
          const userMessageCount = data.filter(m => m.role === 'user').length;
          const assistantMessageCount = data.filter(m => m.role === 'assistant').length;
          setWishCount(userMessageCount);
          setAiMessageCount(assistantMessageCount);
          setShowBanner(false);
        } else {
          setMessages([{
            role: 'assistant',
            content: `Welcome, ${userName}! ✨ You have unlimited wishes. What visa journey would you like to explore today?`,
          }]);
          setWishCount(0);
          setAiMessageCount(0);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([{
          role: 'assistant',
          content: `Welcome, ${userName}! You have unlimited wishes.`,
        }]);
      } finally {
        setIsLoadingMessages(false);
      }
    }

    if (!authLoading && userName !== 'Pathfinder') {
      loadMessages();
    }
  }, [user, authLoading, userName, supabase]);

  const handleClearChat = async () => {
    if (!user) return;
    
    const confirm = window.confirm('Clear all chat history? This cannot be undone.');
    if (!confirm) return;

    setIsClearing(true);
    try {
      const { error } = await supabase
        .from('messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('deleted_at', null);

      if (error) throw error;

      setMessages([{
        role: 'assistant',
        content: `Welcome back, ${userName}! ✨ You have unlimited wishes. What visa journey would you like to explore today?`,
      }]);
      setWishCount(0);
      setAiMessageCount(0);
      setInsights(null);
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('Failed to clear chat. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          role,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCtaClick = () => {
    router.push('/your-next-steps');
  };

  const renderMessageContent = (content: string) => {
    return (
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: content
            .replace(/(Sign up|Unlock your step-by-step plan|See your .* timeline|Get your .* checklist)/g, 
              `<span class="text-blue-600 font-medium cursor-pointer hover:underline">$1</span>`)
            .replace(/(⚠️ Limited-time: .* sign up now)/g,
              `<span class="text-red-600 font-medium cursor-pointer hover:underline">$1</span>`)
        }} 
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('.cursor-pointer')) {
            handleCtaClick();
          }
        }}
      />
    );
  };

  // Helper to add name to AI response if needed
  const addNameToResponse = (response: string, shouldMention: boolean): string => {
    if (!shouldMention || !user || userName === 'Pathfinder') return response;

    // Add name naturally at the beginning of response
    const greetings = [
      `Great question, ${userName}!`,
      `${userName}, here's what you need to know:`,
      `Let me help you with that, ${userName}.`,
      `${userName}, I'm glad you asked.`,
      `Perfect timing, ${userName}!`,
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    return `${randomGreeting} ${response}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = currentInput.trim();
    if (!trimmed || isTyping) return;

    if (showBanner) setShowBanner(false);

    if (!user && wishCount >= MAX_WISHES) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: trimmed },
        { 
          role: 'assistant', 
          content: "You've used all 3 wishes! Sign in with Google for unlimited visa guidance." 
        },
      ]);
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
    
    if (newWishCount === 1 && messages.length === 1) {
      setMessages([userMessage]);
    } else {
      setMessages((prev) => [...prev, userMessage]);
    }
    
    setCurrentInput('');
    setIsTyping(true);
    setIsInsightsLoading(true);

    try {
      const conversationHistory = !user 
        ? messages
            .filter(m => m.content !== "Welcome, Pathfinder! I'm Japa Genie, your magical guide to global relocation. I can grant you 3 powerful wishes to map out your visa journey. What is your first wish?")
            .map(m => ({ role: m.role, content: m.content }))
        : [];
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: trimmed,
          wishCount: newWishCount,
          conversationHistory,
        }),
      });

      const chatResult = await response.json();
      
      if (!response.ok) {
        throw new Error(chatResult.error || 'Failed to get response');
      }

      let aiResponse = chatResult.answer;

      // Add name every 5 AI messages
      const shouldMentionName = user && (newAiCount % NAME_MENTION_FREQUENCY === 0);
      aiResponse = addNameToResponse(aiResponse, shouldMentionName);

      const assistantMessage: Message = { role: 'assistant', content: aiResponse };
      
      if (user) {
        const savedMsg = await saveMessage('assistant', aiResponse);
        if (savedMsg) assistantMessage.id = savedMsg.id;
      }
      
      setMessages((prev) => [...prev, assistantMessage]);
      setWishCount(newWishCount);
      setAiMessageCount(newAiCount);

      const isVisaRelated = (text: string) => {
        const lower = text.toLowerCase();
        const countries = ['canada','australia','usa','uk','spain','germany','france','italy','netherlands','nigeria','ghana','kenya'];
        const visaKeywords = ['visa','immigration','relocate','move to','work in','study in','travel to'];
        return countries.some(c => lower.includes(c)) || visaKeywords.some(k => lower.includes(k));
      };

      if (isVisaRelated(trimmed)) {
        try {
          const insightsResponse = await fetch('/api/insights', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question: trimmed,
              aiResponse: aiResponse
            }),
          });
          
          if (insightsResponse.ok) {
            const insightsResult = await insightsResponse.json();
            setInsights(insightsResult);
          }
        } catch (error) {
          console.error("Insights error:", error);
        }
      }

    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Wish ${wishCount + 1}: Temporary error. Trusted by ${SOCIAL_PROOF_COUNT}+ professionals — Unlock your step-by-step plan — Sign up`,
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsInsightsLoading(false);
    }
  };

  const wishesLeft = user ? Infinity : MAX_WISHES - wishCount;

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
        {showBanner && !user && messages.length <= 1 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <div className="max-w-2xl mx-auto">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Make Your 3 Wishes Count!
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                To get the most valuable insider tips, tell me:
              </p>
              <ul className="text-xs text-gray-600 space-y-1 ml-4">
                <li>✅ Where you're from (e.g., Lagos, Nigeria)</li>
                <li>✅ Where you want to go (e.g., France, Canada, UK)</li>
                <li>✅ Your visa type (Study, Work, Visit—or say "not sure")</li>
              </ul>
              <p className="text-xs text-blue-600 font-medium mt-2">
                💡 Example: "I'm from Lagos, want to study in Canada"
              </p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 py-1.5 px-4 text-center text-xs text-blue-700 font-medium flex items-center justify-between">
          <span>Trusted by {SOCIAL_PROOF_COUNT}+ professionals</span>
          {user && messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              disabled={isClearing}
              className="h-6 px-2 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              {isClearing ? 'Clearing...' : 'Clear Chat'}
            </Button>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 relative z-10">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border rounded-bl-none shadow'
                }`}
              >
                {msg.content.includes('Wish') 
                  ? renderMessageContent(msg.content) 
                  : msg.content}
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
        </div>

        <div className="p-4 border-t bg-white/80 backdrop-blur relative z-10">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={wishesLeft > 0 ? "default" : "secondary"}>
              {user 
                ? '✨ Unlimited wishes' 
                : wishesLeft > 0 
                  ? `${wishesLeft} wish${wishesLeft !== 1 ? 'es' : ''} left` 
                  : 'All wishes used — Sign in for more'
              }
            </Badge>
            <div className="text-xs text-gray-500">
              {user ? `Wish ${wishCount}` : `Wish ${wishCount} of ${MAX_WISHES}`}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={
                user
                  ? "Ask your next wish..."
                  : wishCount === 0 
                    ? "Ask for your first wish..." 
                    : wishCount < MAX_WISHES 
                      ? "Ask your next wish..." 
                      : "Sign in for unlimited questions"
              }
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping || (!user && wishCount >= MAX_WISHES)}
            />
            <button
              type="submit"
              disabled={isTyping || !currentInput.trim() || (!user && wishCount >= MAX_WISHES)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {isTyping ? '...' : (!user && wishCount >= MAX_WISHES) ? 'Sign In' : 'Send'}
            </button>
          </form>
          
          {!user && wishCount >= MAX_WISHES && (
            <div className="mt-3">
              <CheckoutButton />
            </div>
          )}
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
                insights.difficulty === 'High'
                  ? 'bg-red-100 text-red-800'
                  : insights.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {insights.difficulty || 'Medium'}
              </span>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Expected Timeline</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{
                    width: 
                      insights.timeline?.includes('1–3') ? '25%' :
                      insights.timeline?.includes('4–6') ? '50%' :
                      insights.timeline?.includes('6–12') ? '75%' : '100%'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{insights.timeline || 'Varies'}</p>
            </div>
            
            {insights.recommendations && insights.recommendations.length > 0 && (
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
              Ask a visa-related question to see AI-powered insights about your immigration journey.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}