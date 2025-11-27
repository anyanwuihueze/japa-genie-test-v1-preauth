'use client';

import useVisaPulse from '@/lib/useVisaPulse';

export default function VisaPulseTicker() {
  const { pulse, isLoading, error } = useVisaPulse(30);

  console.log('🎫 Ticker Status:', { 
    pulseCount: pulse?.length, 
    isLoading, 
    hasError: !!error,
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-slate-900 border-t-2 border-amber-400 py-3 text-center text-slate-300 font-medium">
        ⏳ Loading visa updates...
      </div>
    );
  }

  // Show error state
  if (error) {
    console.error('🎫 Ticker Error:', error);
    return null; // Fail silently with fallback data
  }

  // Show no data state (shouldn't happen with fallback)
  if (!pulse || pulse.length === 0) {
    return null;
  }

  // Get emoji and color based on category
  const getCategoryStyle = (category: string) => {
    switch(category) {
      case 'approval': 
        return { emoji: '✅', color: 'text-emerald-400' };
      case 'refusal': 
        return { emoji: '❌', color: 'text-red-400' };
      case 'tip': 
        return { emoji: '💡', color: 'text-amber-400' };
      default: 
        return { emoji: '📰', color: 'text-white' };
    }
  };

  // Get country flag emoji
  const getCountryFlag = (code: string) => {
    if (!code) return '🌍';
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // SUCCESS - Render premium ticker
  return (
    <div className="w-full bg-slate-900 border-t-2 border-amber-400 py-4 overflow-hidden shadow-lg">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 pointer-events-none opacity-50"></div>
      
      <div className="relative">
        {/* Animated ticker with hover pause */}
        <div className="flex animate-ticker hover:pause-animation">
          {/* FIRST SET */}
          {pulse.map((item) => {
            const style = getCategoryStyle(item.category);
            return (
              <div
                key={item.id}
                className="inline-flex items-center px-8 whitespace-nowrap flex-shrink-0 group"
              >
                <span className={`text-sm font-semibold ${style.color} drop-shadow-lg transition-all group-hover:scale-110`}>
                  {style.emoji} {getCountryFlag(item.country_code)}
                </span>
                <span className="ml-3 text-sm font-medium text-white drop-shadow-md">
                  {item.headline}
                </span>
                <span className="mx-6 text-amber-400/40 text-lg">•</span>
              </div>
            );
          })}
          
          {/* DUPLICATE SET for seamless loop */}
          {pulse.map((item) => {
            const style = getCategoryStyle(item.category);
            return (
              <div
                key={`${item.id}-dup`}
                className="inline-flex items-center px-8 whitespace-nowrap flex-shrink-0 group"
              >
                <span className={`text-sm font-semibold ${style.color} drop-shadow-lg transition-all group-hover:scale-110`}>
                  {style.emoji} {getCountryFlag(item.country_code)}
                </span>
                <span className="ml-3 text-sm font-medium text-white drop-shadow-md">
                  {item.headline}
                </span>
                <span className="mx-6 text-amber-400/40 text-lg">•</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Subtle bottom shadow for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-transparent to-black/20"></div>
    </div>
  );
}