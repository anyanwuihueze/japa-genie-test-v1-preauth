'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

const USD_TO_NGN_RATE = 1500;

function CheckoutContent() {
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Try to get plan from URL params first
    const planParam = searchParams?.get('plan');
    if (planParam) {
      try {
        const decodedPlan = JSON.parse(decodeURIComponent(planParam));
        setPlan(decodedPlan);
        // Also save to localStorage as backup
        localStorage.setItem('selectedPlan', JSON.stringify(decodedPlan));
        return;
      } catch (error) {
        console.error('Error parsing plan from URL:', error);
      }
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('selectedPlan');
    if (saved) {
      setPlan(JSON.parse(saved));
    }
  }, [searchParams]);

  const handlePayment = async () => {
    if (!plan) return;
    setLoading(true);

    try {
      const endpoint = paymentMethod === 'paystack' 
        ? '/api/paystack/create' 
        : '/api/create-checkout';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: plan.name,
          price: plan.price,
          duration: plan.duration || plan.interval
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      const data = await response.json();
      
      // Show conversion info for Paystack
      if (paymentMethod === 'paystack' && data.ngnAmount) {
        console.log(`✅ Converted: $${data.usdAmount} → ₦${data.ngnAmount.toLocaleString()}`);
      }
      
      // ✅ KEEP for external payment URLs (Stripe/Paystack)
      // These MUST open in browser for payment processing
      window.location.href = data.url;
    } catch (error: any) {
      alert(error.message || 'Payment error. Please try again.');
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Plan Selected</h2>
          {/* ✅ FIXED: Use router.push for PWA compatibility */}
          <Button onClick={() => router.push('/pricing')}>
            Back to Plans
          </Button>
        </div>
      </div>
    );
  }

  const ngnPrice = plan.price * USD_TO_NGN_RATE;

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">${plan.price} USD</p>
              <p className="text-sm text-gray-600">{plan.name}</p>
              {paymentMethod === 'paystack' && (
                <p className="text-sm text-blue-600 mt-1">
                  ≈ ₦{ngnPrice.toLocaleString()} NGN
                </p>
              )}
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 border p-3 rounded">
                <RadioGroupItem value="stripe" id="stripe" />
                <label htmlFor="stripe" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium">Stripe (International Cards)</p>
                    <p className="text-xs text-gray-500">Pay in USD</p>
                  </div>
                </label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded">
                <RadioGroupItem value="paystack" id="paystack" />
                <label htmlFor="paystack" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium">Paystack (Nigeria)</p>
                    <p className="text-xs text-gray-500">
                      Pay ₦{ngnPrice.toLocaleString()} (@ ₦{USD_TO_NGN_RATE}/$1)
                    </p>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={handlePayment} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Processing...
                </>
              ) : (
                `Pay ${paymentMethod === 'paystack' ? `₦${ngnPrice.toLocaleString()}` : `$${plan.price}`}`
              )}
            </Button>
            {/* ✅ FIXED: Use router.push for PWA compatibility */}
            <Button 
              variant="outline" 
              onClick={() => router.push('/pricing')}
              className="w-full"
            >
              Back to Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
