'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function CheckoutButton() {
  const { user, loading } = useAuth();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in first');
      return;
    }
    
    if (!acceptedTerms) {
      alert('Please accept the Terms & Conditions');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { url, error } = await res.json();
      
      if (error) {
        alert(error);
        return;
      }

      if (!url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
      
    } catch (e: any) {
      console.error('Checkout error:', e);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-12 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">Upgrade to Premium</h3>
        <p className="text-sm text-gray-600">Unlock unlimited wishes and personalized visa guidance</p>
      </div>

      <div className="space-y-3 py-4 border-t border-b border-purple-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Premium Visa Guidance</span>
          <span className="text-xl font-bold text-gray-900">$29.00</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Unlimited AI wishes & guidance
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Personalized visa roadmap
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Document checklist & templates
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Priority support
          </li>
        </ul>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          checked={acceptedTerms} 
          onCheckedChange={(c) => setAcceptedTerms(!!c)} 
          className="mt-1" 
        />
        <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
          I agree to the{' '}
          <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Terms & Conditions
          </a>
          {' '}and{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      <Button 
        onClick={handleCheckout} 
        disabled={!acceptedTerms || isLoading || !user || loading} 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Redirecting to checkout...' : !user ? 'Sign in to upgrade' : 'Proceed to Checkout'}
      </Button>

      <p className="text-xs text-center text-gray-500">Secure payment powered by Stripe</p>
    </div>
  );
}