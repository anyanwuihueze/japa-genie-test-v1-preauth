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
    router.push(`/checkout?plan=${encodedPlan}`);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Upgrade Your Journey</h3>
        <p className="text-sm text-gray-600">Choose the plan that fits your needs</p>
      </div>

      {/* Weekly Access Plans */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h4 className="font-semibold text-gray-700">🚀 Weekly Access</h4>
        </div>
        
        <div className="grid gap-3">
          {oneTimeCredits.map((plan, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                    <p className="text-sm text-gray-600">{plan.duration}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">${plan.price}</div>
                    <Badge variant="secondary" className="text-xs">
                      One-time
                    </Badge>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-gray-600 mb-3">
                  {plan.features.slice(0, 2).map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 2 && (
                    <li className="text-gray-500">+ {plan.features.length - 2} more features</li>
                  )}
                </ul>
                <Button 
                  onClick={() => handlePlanSelect(plan)}
                  variant="outline"
                  className="w-full text-sm py-2"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monthly Subscription Plans */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h4 className="font-semibold text-gray-700">📅 Monthly Subscription</h4>
        </div>
        
        <div className="grid gap-3">
          {subscriptionTiers.map((plan, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                      {plan.popular && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{plan.duration}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${plan.price}
                      <span className="text-sm font-normal text-gray-600">{plan.frequency}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Subscription
                    </Badge>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-gray-600 mb-3">
                  {plan.features.slice(0, 2).map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 2 && (
                    <li className="text-gray-500">+ {plan.features.length - 2} more features</li>
                  )}
                </ul>
                <Button 
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full text-sm py-2 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  } text-white`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/pricing')}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          View detailed comparison →
        </Button>
      </div>
    </div>
  );
}

// Keep existing exports for backward compatibility
export { oneTimeCredits, subscriptionTiers, allPlans } from '@/lib/pricing';