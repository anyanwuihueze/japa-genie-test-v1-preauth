
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { allPlans as plans } from '@/lib/pricing'; // Import from new unified file
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function YourNextStepsClient() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const searchParams = useSearchParams();
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    // Check if redirected because login required
    if (searchParams?.get('login_required') === 'true') {
      setShowLoginAlert(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => setShowLoginAlert(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handlePlanClick = (plan: any) => {
    // Check if user is logged in
    if (!user) {
      setShowLoginAlert(true);
      return;
    }

    setSelectedPlan(plan);
    setAcceptedTerms(false);
    setShowModal(true);
  };

  const handleAccept = () => {
    // Save to localStorage as backup
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    
    // Go to checkout
    window.location.href = `/checkout`;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>

        {showLoginAlert && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex items-center justify-between">
              <span>Please log in to purchase a plan</span>
              <Button 
                size="sm" 
                onClick={() => signInWithGoogle()}
                className="ml-4"
              >
                Log In Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => handlePlanClick(plan)}
            >
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold text-blue-600 mb-4">${plan.price}{plan.frequency}</p>
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
                <Link href="/terms-and-conditions" className="text-blue-600 underline" target="_blank">Terms & Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-blue-600 underline" target="_blank">Privacy Policy</Link>
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
