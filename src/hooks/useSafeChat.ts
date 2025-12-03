'use client';

import { useContext } from 'react';

// Create a safe version that doesn't throw if context is missing
export function useSafeChat() {
  try {
    const { ChatContext } = require('@/context/ChatContext');
    const context = useContext(ChatContext);
    return context || { isChatOpen: false, setIsChatOpen: () => {} };
  } catch (error) {
    // Return default values if context is not available
    return { isChatOpen: false, setIsChatOpen: () => {} };
  }
}
