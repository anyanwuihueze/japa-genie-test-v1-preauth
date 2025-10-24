'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const [plan, setPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedPlan');
    if (saved) setPlan(JSON.parse(saved));
  }, []);

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

      if (!response.ok) throw new Error('Payment failed');

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      alert('Payment error. Please try again.');
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Plan Selected</h2>
          <Button onClick={() => window.location.href = '/your-next-steps'}>
            Back to Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">${plan.price}</p>
              <p className="text-sm text-gray-600">{plan.name}</p>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 border p-3 rounded">
                <RadioGroupItem value="stripe" id="stripe" />
                <label htmlFor="stripe" className="cursor-pointer flex-1">Stripe (International Cards)</label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded">
                <RadioGroupItem value="paystack" id="paystack" />
                <label htmlFor="paystack" className="cursor-pointer flex-1">Paystack (Nigeria)</label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={handlePayment} disabled={loading} className="w-full">
              {loading ? <><Loader2 className="animate-spin mr-2" /> Processing...</> : `Pay $${plan.price}`}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/your-next-steps'}
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
