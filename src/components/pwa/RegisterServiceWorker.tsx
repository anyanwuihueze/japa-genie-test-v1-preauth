'use client'

import { useEffect } from 'react'

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/', updateViaCache: 'none' })
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope)
          })
          .catch((error) => {
            console.warn('⚠️ Service Worker failed:', error)
          })
      })
    }
  }, [])
  return null
}
