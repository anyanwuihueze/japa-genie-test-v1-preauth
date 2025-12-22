'use client'

import { useState, useEffect } from 'react'

export function useEnhancedMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const checkMobile = () => {
      // Method 1: Screen width
      const isMobileByWidth = window.innerWidth < 768
      
      // Method 2: User agent detection
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileByUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // Method 3: Touch capability
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Method 4: Check for mobile device features
      const hasMobileFeatures = 'orientation' in window || 'connection' in navigator
      
      // Combined detection - prioritize UA, then width, then touch
      const finalIsMobile = isMobileByUA || isMobileByWidth || (isTouchDevice && hasMobileFeatures)
      
      setIsMobile(finalIsMobile)
      
      // Debug log
      console.log('📱 Mobile Detection:', {
        width: window.innerWidth,
        isMobileByWidth,
        isMobileByUA,
        isTouchDevice,
        hasMobileFeatures,
        final: finalIsMobile
      })
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return !!isMobile
}

// Device type detection
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent.toLowerCase()
      
      if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        setDeviceType('mobile')
      } else if (/ipad/i.test(userAgent) || (width >= 768 && width < 1024)) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    return () => window.removeEventListener('resize', updateDeviceType)
  }, [])

  return deviceType
}
