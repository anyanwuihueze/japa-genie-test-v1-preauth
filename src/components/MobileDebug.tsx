'use client'

import { useEnhancedMobile, useDeviceType } from '@/hooks/use-enhanced-mobile'

export function MobileDebug() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }
  
  const isMobile = useEnhancedMobile()
  const deviceType = useDeviceType()
  
  return (
    <div className="fixed bottom-0 right-0 z-[99999] pointer-events-none">
      <div className={`px-2 py-1 text-xs font-mono ${isMobile ? 'bg-green-500' : 'bg-blue-500'} text-white rounded-tl`}>
        {isMobile ? '📱' : '💻'} {deviceType.toUpperCase()}
      </div>
    </div>
  )
}
