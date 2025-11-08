'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { oneTimeCredits, subscriptionTiers } from '@/lib/pricing';
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
import { Info, Check } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function PricingPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const searchParams = useSearchParams();
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (searchParams?.get('login_required') === 'true') {
      setShowLoginAlert(true);
      const timer = setTimeout(() => setShowLoginAlert(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handlePlanClick = (plan: any) => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    setSelectedPlan(plan);
    setAcceptedTerms(false);
    setShowModal(true);
  };

  const handleAccept = () => {
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    window.location.href = `/checkout`;
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="container px-4 py-12 md:py-20">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Find the Plan That's Right for You
          </h1>
        </header>

        {showLoginAlert && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex items-center justify-between">
              <span>Please log in to purchase a plan.</span>
              <Button 
                size="sm" 
                onClick={() => signInWithGoogle('/pricing')}
                className="ml-4"
              >
                Log In Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {oneTimeCredits.map((plan) => (
            <Card
              key={plan.name}
              onClick={() => handlePlanClick(plan)}
              className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
                <p className="text-2xl md:text-3xl font-bold pt-2">${plan.price}</p>
                <CardDescription className="text-sm md:text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="secondary">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-12">
            {subscriptionTiers.map((tier) => (
            <Card
                key={tier.name}
                onClick={() => handlePlanClick(tier)}
                className={`flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow ${tier.popular ? 'border-primary ring-2 ring-primary' : ''}`}
            >
                {tier.popular && (
                <div className="py-1 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg text-center">
                    Most Popular
                </div>
                )}
                <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="pt-4">
                    <span className="text-3xl md:text-4xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">{tier.frequency}</span>
                </div>
                </CardHeader>
                <CardContent className="flex-1">
                <ul className="space-y-3 md:space-y-4">
                    {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                    ))}
                </ul>
                </CardContent>
                <CardFooter>
                <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                    {tier.cta}
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>

        <AlertDialog open={showModal} onOpenChange={setShowModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Accept Terms & Conditions</AlertDialogTitle>
              <AlertDialogDescription>
                Please accept our terms to proceed with your purchase of the {selectedPlan?.name}.
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
                <Link href="/privacy-policy" className="text-blue-600 underline" target="_blank">Privacy Policy</Link>.
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
    </div>
  );
}
