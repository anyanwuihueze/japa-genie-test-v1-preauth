
export const oneTimeCredits = [
  {
    name: '1 Week Access',
    price: 10,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h', 
    duration: '7-day access',
    features: ['Unlimited AI chat', 'Document checker', 'Mock interviews'],
    cta: 'Top Up for 1 Week',
  },
  {
    name: '2 Weeks Access',
    price: 15,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h',
    duration: '14-day access',
    features: [
      'Everything in 1 week plan',
      'Prioritized response time',
      'Visa pathway optimization',
    ],
    cta: 'Top Up for 2 Weeks',
  },
  {
    name: '3 Weeks Access',
    price: 25,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h',
    duration: '21-day access',
    features: [
      'Everything in 2 weeks plan',
      'Rejection risk score',
      'Personalized pathway plan',
    ],
    cta: 'Top Up for 3 Weeks',
  },
];

export const subscriptionTiers = [
  {
    name: 'Pro Plan',
    price: 20,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h', 
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
    name: 'Hold My Hand Premium',
    price: 40,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h',
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

// This is the single source of truth for all plans
export const allPlans = [...oneTimeCredits, ...subscriptionTiers];
