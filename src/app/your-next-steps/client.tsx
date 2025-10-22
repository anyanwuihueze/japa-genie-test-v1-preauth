'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { plans } from '@/lib/plans';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function YourNextStepsClient() {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCheckout = async (plan: any) => {
    // Check terms acceptance first
    if (!acceptedTerms) {
      alert('Please accept the Terms & Conditions before proceeding.');
      return;
    }

    // Check if user is logged in
    if (!user) {
      alert('Please sign in to continue.');
      await signInWithGoogle();
      return;
    }

    setLoadingPlan(plan.name);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: plan.name,
          planPrice: plan.price,  // Fixed: Send the actual plan price
          planDuration: plan.duration || plan.interval,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (!url) {
        throw new Error('Stripe checkout URL not found.');
      }

      // Use window.location for full page redirect to Stripe
      window.location.href = url;
      
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      alert(`Failed to initiate payment: ${error.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };
  
  const weeklyPlans = plans.slice(0, 3);
  const monthlyPlans = plans.slice(3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Visa Journey, Simplified
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start with 3 free wishes. Join 5,200+ Africans who got real answers — no scams, no agents, no stress.
          </p>
        </div>

        {/* WEEKLY TOP-UP PLANS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {weeklyPlans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-4">{plan.duration}</p>
                <div className="mb-6">
                  <p className="text-2xl font-bold text-blue-600 mb-1">${plan.price}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="default"
                className="w-full"
                onClick={() => handleCheckout(plan)}
                disabled={authLoading || loadingPlan === plan.name || !acceptedTerms}
              >
                {loadingPlan === plan.name ? <Loader2 className="animate-spin" /> : plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* MONTHLY PLANS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {monthlyPlans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
               {plan.name === 'Pro Plan' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
              <div>
                <h2 className="text-xl font-bold mb-2 mt-4">{plan.name}</h2>
                <p className="text-gray-600 mb-4">
                  {plan.interval ? `$${plan.price}/${plan.interval}` : ''}
                </p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant={plan.name === 'Pro Plan' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => handleCheckout(plan)}
                disabled={authLoading || loadingPlan === plan.name || !acceptedTerms}
              >
                {loadingPlan === plan.name ? <Loader2 className="animate-spin" /> : plan.cta}
              </Button>
            </div>
          ))}
        </div>
        
        {/* Terms and Conditions Checkbox - PLACED BEFORE BUTTONS */}
        <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-start space-x-2 p-4 border rounded-md bg-white">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms} 
                  onCheckedChange={(c) => setAcceptedTerms(!!c)} 
                  className="mt-1" 
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Privacy Policy
                  </Link>.
                </label>
            </div>

            <p className="text-xs text-center text-gray-500">
              You must accept the terms to proceed to payment. Secure payments by Stripe.
            </p>
        </div>

      </div>
    </section>
  );
}