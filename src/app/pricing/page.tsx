'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { Info, Check, Sparkles, Lock, Zap, Ticket, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

// Define proper types for your plans
interface OneTimeCreditPlan {
  name: string;
  price: number;
  priceId: string;
  duration: string;
  features: string[];
  cta: string;
  description?: string;
}

interface SubscriptionTier {
  name: string;
  price: number;
  priceId: string;
  frequency: string;
  duration: string;
  features: string[];
  cta: string;
  popular: boolean;
  description: string;
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading pricing...</div>}>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const searchParams = useSearchParams();
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (searchParams?.get('login_required') === 'true') {
      setShowLoginAlert(true);
      const timer = setTimeout(() => setShowLoginAlert(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // ✅ ENHANCED: Get redirect reason for context-aware messaging
  const redirectReason = searchParams?.get('reason');
  const returnTo = searchParams?.get('returnTo');

  // ✅ ENHANCED: Context-aware header messaging
  const getHeaderMessage = () => {
    switch (redirectReason) {
      case 'wishes_exhausted':
        return {
          title: "Continue Your Visa Journey",
          subtitle: "You've used your free wishes. Choose a plan for unlimited AI guidance and personalized support."
        };
      case 'dashboard_access':
        return {
          title: "Unlock Your Dashboard",
          subtitle: "Access your progress tracking, saved conversations, and personalized roadmap."
        };
      case 'tool_access':
          case 'cost_calculator':
            return {
              icon: <Zap className="w-6 h-6 text-orange-500" />,
              title: 'Complete Your Visa Cost Calculation',
              message: 'Unlock full cost breakdown for your visa',
              bgColor: 'bg-orange-500/10',
              borderColor: 'border-orange-500/30',
              textColor: 'text-orange-400'
            };
        return {
          title: "Access Premium Tools",
          subtitle: "Upgrade to use document verification, visa matchmaker, and other advanced features."
        };
      default:
        return {
          title: "Find the Plan That's Right for You",
          subtitle: "Start your visa journey with confidence and expert guidance."
        };
    }
  };

  const headerMessage = getHeaderMessage();

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
    
    // ✅ ENHANCED: Preserve returnTo parameter for seamless redirect after payment
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo');
    const checkoutUrl = returnTo ? `/checkout?returnTo=${encodeURIComponent(returnTo)}` : '/checkout';
    
    window.location.href = checkoutUrl;
  };

  // ✅ NEW: Promo code handler
  const handlePromoSubmit = async () => {
    if (!promoCode.trim()) return;
    
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    
    setPromoLoading(true);
    setPromoMessage('');
    
    try {
      const response = await fetch('/api/promo/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoCode: promoCode.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setPromoMessage(`✅ ${data.message} Redirecting to dashboard...`);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setPromoMessage(`❌ ${data.error}`);
      }
    } catch (error: any) {
      setPromoMessage('❌ Failed to activate promo code. Please try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  // ✅ ENHANCED: Context-aware CTA button
  const getCtaButton = (plan: any) => {
    if (!user) {
      return plan.cta;
    }
    
    switch (redirectReason) {
      case 'wishes_exhausted':
        return `Continue Chat • ${plan.cta}`;
      case 'dashboard_access':
        return `Access Dashboard • ${plan.cta}`;
      case 'tool_access':
          case 'cost_calculator':
            return {
              icon: <Zap className="w-6 h-6 text-orange-500" />,
              title: 'Complete Your Visa Cost Calculation',
              message: 'Unlock full cost breakdown for your visa',
              bgColor: 'bg-orange-500/10',
              borderColor: 'border-orange-500/30',
              textColor: 'text-orange-400'
            };
        return `Unlock Tools • ${plan.cta}`;
      default:
        return plan.cta;
    }
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="container px-4 py-12 md:py-20">
        <header className="text-center space-y-4 mb-12">
          {/* ✅ ENHANCED: Context-aware header */}
          {redirectReason && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
                {redirectReason === 'wishes_exhausted' && <Sparkles className="w-4 h-4" />}
                {redirectReason === 'dashboard_access' && <Lock className="w-4 h-4" />}
                {redirectReason === 'tool_access' && <Zap className="w-4 h-4" />}
                <span className="font-medium">
                  {redirectReason === 'wishes_exhausted' && 'Free Wishes Used'}
                  {redirectReason === 'dashboard_access' && 'Dashboard Locked'}
                  {redirectReason === 'tool_access' && 'Premium Feature'}
                </span>
              </div>
            </div>
          )}
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {headerMessage.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {headerMessage.subtitle}
          </p>

          {/* ✅ SECURE: Promo Code Section - NO CODE DISPLAY */}
          {showPromo ? (
            <div className="max-w-md mx-auto mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Enter Promo Code</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Enter your exclusive promo code for 7-day free access</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter your code here"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Button 
                  onClick={handlePromoSubmit} 
                  disabled={promoLoading || !promoCode.trim()}
                  className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                >
                  {promoLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Applying...
                    </>
                  ) : (
                    'Apply Code'
                  )}
                </Button>
              </div>
              {promoMessage && (
                <p className={`mt-2 text-sm ${promoMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {promoMessage}
                </p>
              )}
              <div className="mt-3 text-xs text-gray-500">
                <p>💡 <strong>Limited availability:</strong> 7-day trial codes are distributed privately</p>
              </div>
              <button 
                onClick={() => setShowPromo(false)}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                ← Back to pricing plans
              </button>
            </div>
          ) : (
            <div className="text-center mt-6">
              <button 
                onClick={() => setShowPromo(true)}
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full transition-colors"
              >
                <Ticket className="w-4 h-4" />
                Have a promo code? Get 7-day free trial
              </button>
            </div>
          )}
        </header>

        {showLoginAlert && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex items-center justify-between">
              <span>Please log in to purchase a plan or use promo codes.</span>
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

        {/* One-Time Credits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">One-Time Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(oneTimeCredits as OneTimeCreditPlan[]).map((plan) => (
              <Card
                key={plan.name}
                onClick={() => handlePlanClick(plan)}
                className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
              >
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
                  <p className="text-2xl md:text-3xl font-bold pt-2">${plan.price}</p>
                  <CardDescription className="text-sm md:text-base">
                    {plan.description || ''}
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
                    {getCtaButton(plan)}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Subscription Tiers */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {(subscriptionTiers as SubscriptionTier[]).map((tier) => (
              <Card
                  key={tier.name}
                  onClick={() => handlePlanClick(tier)}
                  className={`flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow ${tier.popular ? 'border-primary ring-2 ring-primary' : 'border-2 hover:border-blue-200'}`}
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
                      {getCtaButton(tier)}
                  </Button>
                  </CardFooter>
              </Card>
              ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>All plans include access to our AI visa assistant and basic features.</p>
          <p>Need help choosing? <Link href="/contact-us" className="text-blue-600 underline">Contact our team</Link></p>
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
