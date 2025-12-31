'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useSwipeNavigation() {
  const router = useRouter();
  
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      
      // Swipe right to go back (like iOS)
      if (swipeDistance > swipeThreshold && window.history.length > 1) {
        router.back();
      }
      // Swipe left could go forward, but less common
    };
    
    // Add touch listeners
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [router]);
}
