'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle, User, LogOut, LogIn, Home, MapPin, Lightbulb, Users, Tag, Newspaper, Building, ChevronRight, Sparkles } from 'lucide-react';
import { JapaGenieLogo } from '@/components/icons';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/lib/AuthContext';

export default function SimpleHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { setIsChatOpen } = useChat();
  const { user, signInWithGoogle, signOut } = useAuth();

  const openChat = () => {
    setIsChatOpen(true);
    setIsOpen(false);
  };

  const handleSignIn = () => {
    signInWithGoogle();
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Where You\'re Stuck', href: '/where-youre-stuck', icon: MapPin, hoverIcon: ChevronRight },
    { name: 'How It Helps', href: '/how-it-helps', icon: Lightbulb, hoverIcon: ChevronRight },
    { name: 'Expert Help', href: '/experts', icon: Users, hoverIcon: ChevronRight },
    { name: 'Pricing', href: '/pricing', icon: Tag, hoverIcon: ChevronRight },
    { name: 'Blog', href: '/blog', icon: Newspaper, hoverIcon: ChevronRight },
    { name: 'About Us', href: '/about-us', icon: Building, hoverIcon: ChevronRight },
  ];

  const getIcon = (itemName: string, IconComponent: any, HoverIcon: any) => {
    if (hoveredNav === itemName) {
      return <HoverIcon size={16} className="text-blue-600 transition-all duration-300" strokeWidth={2.5} />;
    }
    return <IconComponent size={16} className="text-slate-500 transition-all duration-300" strokeWidth={2} />;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 font-semibold text-xl text-slate-900 hover:text-blue-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <JapaGenieLogo className="h-9 w-9" />
            <span className="hidden sm:inline tracking-tight">Japa Genie</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 text-[15px] font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
              onMouseEnter={() => setHoveredNav('home')}
              onMouseLeave={() => setHoveredNav(null)}
            >
              {getIcon('home', Home, ChevronRight)}
              <span>Home</span>
            </Link>
            
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2.5 text-[15px] font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                onMouseEnter={() => setHoveredNav(item.name)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {getIcon(item.name, item.icon, item.hoverIcon)}
                <span className="tracking-tight">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50/80 text-blue-700 border border-blue-100">
                  <User size={18} strokeWidth={2} />
                  <span className="text-[15px] font-medium tracking-tight">{user.email?.split('@')[0]}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 text-[15px] font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 tracking-tight"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50/80 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <LogOut size={18} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSignIn}
                  className="px-5 py-2.5 text-[15px] font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 tracking-tight"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignIn}
                  className="flex items-center gap-2 px-5 py-2.5 text-[15px] font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 tracking-tight"
                >
                  <Sparkles size={16} strokeWidth={2.5} />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 md:hidden text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Menu"
          >
            {isOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Glass Slide from Right */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          {/* Backdrop - Sharp, minimal blur */}
          <div 
            className="absolute inset-0 bg-black/5"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Glass Menu Panel - Slides from Right */}
          <div 
            className="absolute top-0 right-0 bottom-0 w-[85%] bg-gradient-to-br from-white/75 via-white/70 to-white/65 backdrop-blur-3xl rounded-l-[32px] shadow-2xl border-l border-t border-b border-white/40 overflow-hidden"
            style={{ 
              animation: 'slideFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.12), -2px 0 16px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="h-full overflow-y-auto px-6 py-8 pt-20">
              <nav className="flex flex-col gap-2">
                {/* Chat Assistant - Featured */}
                <button
                  onClick={openChat}
                  className="flex items-center gap-4 px-4 py-4 text-left bg-gradient-to-r from-blue-50/80 to-indigo-50/80 hover:from-blue-100/80 hover:to-indigo-100/80 rounded-2xl transition-all duration-300 group border border-blue-100/50 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ animationDelay: '0.05s', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards' }}
                >
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <MessageCircle size={22} className="text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 tracking-tight">Chat Assistant</div>
                    <div className="text-sm text-slate-600 tracking-tight">Get AI visa guidance</div>
                  </div>
                </button>
                
                {/* Navigation Items */}
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50/80 rounded-2xl transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => setIsOpen(false)}
                    style={{ 
                      animationDelay: `${0.1 + (index * 0.05)}s`,
                      animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards'
                    }}
                  >
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-100 transition-all duration-300 group-hover:scale-110">
                      <item.icon size={22} className="text-slate-600 group-hover:text-blue-600 transition-colors duration-300" strokeWidth={2} />
                    </div>
                    <span className="text-slate-700 group-hover:text-blue-600 font-medium transition-colors duration-300 tracking-tight">{item.name}</span>
                  </Link>
                ))}

                {/* Separator */}
                <div className="relative my-4" style={{ animationDelay: '0.4s', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards' }}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-xs font-medium text-slate-500 tracking-wider uppercase">Account</span>
                  </div>
                </div>

                {/* Mobile Auth */}
                {user ? (
                  <>
                    <div 
                      className="px-4 py-3 text-sm text-slate-600 tracking-tight"
                      style={{ animationDelay: '0.45s', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards' }}
                    >
                      Signed in as <span className="font-semibold text-slate-900">{user.email?.split('@')[0]}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 px-4 py-4 hover:bg-blue-50/80 rounded-2xl transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setIsOpen(false)}
                      style={{ animationDelay: '0.5s', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards' }}
                    >
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                        <User size={22} className="text-blue-600" strokeWidth={2} />
                      </div>
                      <span className="text-slate-700 group-hover:text-blue-600 font-medium transition-colors duration-300 tracking-tight">Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-4 px-4 py-4 text-left hover:bg-red-50/80 rounded-2xl transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
                      style={{ animationDelay: '0.55s', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards' }}
                    >
                      <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-all duration-300 group-hover:scale-110">
                        <LogOut size={22} className="text-red-600" strokeWidth={2} />
                      </div>
                      <span className="text-slate-700 group-hover:text-red-600 font-medium transition-colors duration-300 tracking-tight">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSignIn}
                      className="flex items-center gap-4 px-4 py-4 hover:bg-blue-50/80 rounded-2xl transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
                      style={{ animationDelay: '0.45s', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards' }}
                    >
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                        <LogIn size={22} className="text-blue-600" strokeWidth={2} />
                      </div>
                      <span className="text-slate-700 group-hover:text-blue-600 font-medium transition-colors duration-300 tracking-tight">Sign In</span>
                    </button>
                    <button
                      onClick={handleSignIn}
                      className="flex items-center gap-4 px-4 py-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 hover:from-blue-100/80 hover:to-indigo-100/80 rounded-2xl transition-all duration-300 group mt-2 border border-blue-100/50 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ animationDelay: '0.5s', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards' }}
                    >
                      <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Sparkles size={22} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 tracking-tight">Get Started</div>
                        <div className="text-sm text-slate-600 tracking-tight">Start your visa journey</div>
                      </div>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}