export type CheckoutMode = 'payment' | 'subscription';

export type PricingPlan = {
  key: 'one_week' | 'two_weeks' | 'three_weeks' | 'pro_monthly' | 'hold_my_hand';
  name: string;
  price: number;
  priceId: string;
  checkoutMode: CheckoutMode;
  frequency?: string;
  duration: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

export const oneTimeCredits: PricingPlan[] = [
  {
    key: 'one_week',
    name: '1 Week Access',
    price: 11.2,
    priceId: process.env.STRIPE_PRICE_ONE_WEEK || '',
    checkoutMode: 'payment',
    duration: '7-day access',
    features: ['Unlimited AI chat', 'Document checker', 'Mock interviews'],
    cta: 'Top Up for 1 Week',
  },
  {
    key: 'two_weeks',
    name: '2 Weeks Access',
    price: 16.8,
    priceId: process.env.STRIPE_PRICE_TWO_WEEKS || '',
    checkoutMode: 'payment',
    duration: '14-day access',
    features: [
      'Everything in 1 week plan',
      'Prioritized response time',
      'Visa pathway optimization',
    ],
    cta: 'Top Up for 2 Weeks',
  },
  {
    key: 'three_weeks',
    name: '3 Weeks Access',
    price: 28,
    priceId: process.env.STRIPE_PRICE_THREE_WEEKS || '',
    checkoutMode: 'payment',
    duration: '21-day access',
    features: [
      'Everything in 2 weeks plan',
      'Rejection risk score',
      'Personalized pathway plan',
    ],
    cta: 'Top Up for 3 Weeks',
  },
];

export const subscriptionTiers: PricingPlan[] = [
  {
    key: 'pro_monthly',
    name: 'Pro Plan',
    price: 22.4,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    checkoutMode: 'subscription',
    frequency: '/month',
    duration: 'Monthly Subscription',
    features: [
      'Everything in weekly plans',
      'Priority email support',
      'Monthly updates on new opportunities',
    ],
    cta: 'Continue with Pro Plan',
    popular: true,
  },
  {
    key: 'hold_my_hand',
    name: 'Hold My Hand Premium',
    price: 44.8,
    priceId: process.env.STRIPE_PRICE_HOLD_MY_HAND || '',
    checkoutMode: 'subscription',
    frequency: '/month',
    duration: 'Monthly Subscription',
    features: [
      'Everything in Pro Plan',
      'Verified Agent Consultation (separate fee)',
      '1-on-1 Onboarding Call',
      'Dedicated Account Manager',
      'Weekly progress tracking',
    ],
    cta: 'Go All-In with Premium',
    popular: false,
  },
];

export const allPlans: PricingPlan[] = [...oneTimeCredits, ...subscriptionTiers];

export function findPlanByKeyOrName(input: {
  planKey?: string;
  key?: string;
  name?: string;
}): PricingPlan | undefined {
  const requested = input.planKey || input.key;

  if (requested) {
    return allPlans.find((plan) => plan.key === requested);
  }

  if (input.name) {
    return allPlans.find((plan) => plan.name === input.name);
  }

  return undefined;
}
