'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { plans } from '@/lib/plans';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

export default function YourNextStepsClient() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan);
    setAcceptedTerms(false);
    setShowModal(true);
  };

  const handleAccept = () => {
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    window.location.href = '/checkout';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => handlePlanClick(plan)}
            >
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold text-blue-600 mb-4">${plan.price}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-sm">{feature}</li>
                ))}
              </ul>
              <Button className="w-full">{plan.cta}</Button>
            </div>
          ))}
        </div>

        <AlertDialog open={showModal} onOpenChange={setShowModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Accept Terms & Conditions</AlertDialogTitle>
              <AlertDialogDescription>
                Please accept our terms to proceed with {selectedPlan?.name}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-start space-x-2 my-4">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms} 
                onCheckedChange={(checked) => setAcceptedTerms(!!checked)} 
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 underline">Terms & Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link>
              </label>
            </div>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleAccept} disabled={!acceptedTerms}>
                Proceed to Checkout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
