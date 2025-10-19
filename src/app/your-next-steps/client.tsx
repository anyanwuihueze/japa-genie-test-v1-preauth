'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { plans } from '@/lib/plans';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function YourNextStepsClient() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: any) => {
    if (!user) {
      signInWithGoogle();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: plan.priceId, plan }),
      });

      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Visa Journey, Simplified
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start with 3 free wishes. Join 5,200+ Africans who got real answers — no scams, no agents, no stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.slice(0, 3).map((plan) => (
            <div
              key={plan.name}
              className="rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[500px] flex flex-col justify-between"
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
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
                disabled={loading}
              >
                {loading ? 'Processing...' : plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {plans.slice(3).map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[500px] flex flex-col justify-between"
            >
              <div>
                {plan.name === 'Pro Plan' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2 mt-4">{plan.name}</h2>
                <p className="text-gray-600 mb-4">
                  {plan.interval ? `${plan.price}/${plan.interval}` : ''}
                </p>
                <div className="mb-6">
                  <p className="text-2xl font-bold text-blue-600 mb-1">${plan.price}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
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
                disabled={loading}
              >
                {loading ? 'Processing...' : plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
