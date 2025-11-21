// src/components/checkout-button.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscriptionTiers, oneTimeCredits } from '@/lib/pricing';

export default function CheckoutButton() {
  const router = useRouter();

  const handlePlanSelect = (plan: any) => {
    // Encode plan data for checkout page (uses existing flow)
    const encodedPlan = encodeURIComponent(JSON.stringify(plan));
    // NEW: Preserve current location for return after payment
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
    router.push(`/checkout?plan=${encodedPlan}&returnTo=${returnTo}`);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
        <p className="text-gray-600">Get unlimited access to AI visa assistance</p>
      </div>

      {/* Subscription Tiers */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Subscription Plans</h4>
        {subscriptionTiers.map((tier) => (
          <Card key={tier.name} className={`border-2 ${tier.popular ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-bold text-gray-900">{tier.name}</h5>
                  <p className="text-sm text-gray-600">{tier.duration}</p>
                </div>
                {tier.popular && (
                  <Badge className="bg-purple-500 text-white">Popular</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-600 text-sm">{tier.frequency}</span>
                </div>
                <Button 
                  onClick={() => handlePlanSelect(tier)}
                  className={tier.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Select Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* One-Time Credits */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">One-Time Access</h4>
        {oneTimeCredits.map((credit) => (
          <Card key={credit.name} className="border-2 border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-bold text-gray-900">{credit.name}</h5>
                  <p className="text-sm text-gray-600">{credit.duration}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-900">${credit.price}</span>
                </div>
                <Button 
                  onClick={() => handlePlanSelect(credit)}
                  variant="outline"
                >
                  {credit.cta}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features List */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">All Plans Include:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Unlimited visa eligibility checks
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Personalized document checklists
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Proof of funds analysis
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Interview preparation
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Priority email support
          </li>
        </ul>
      </div>
    </div>
  );
}