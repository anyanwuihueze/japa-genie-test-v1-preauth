export const plans = [
  {
    name: '1 Week Access',
    price: 10,  // Fixed: Number for backend (cents: price * 100)
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h',
    duration: '7-day access',
    features: ['Unlimited AI chat', 'Document checker', 'Mock interviews'],
    cta: 'Top Up for 1 Week',
  },
  {
    name: '2 Weeks Access',
    price: 15,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h',  // Update with actual Stripe ID
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
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h',  // Update with actual
    duration: '21-day access',
    features: [
      'Everything in 2 weeks plan',
      'Rejection risk score',
      'Personalized pathway plan',
    ],
    cta: 'Top Up for 3 Weeks',
  },
  {
    name: 'Pro Plan',
    price: 20,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h',  // Update with actual
    interval: 'month',
    features: [
      'Everything in weekly plans',
      'Priority email support',
      'Monthly updates on new opportunities',
    ],
    cta: 'Continue with Pro Plan',
  },
  {
    name: 'Hold My Hand Premium',
    price: 40,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h',  // Update with actual
    interval: 'month',
    features: [
      'Everything in Pro Plan',
      'Verified Agent Consultation (separate fee)',
      '1-on-1 Onboarding Call',
      'Dedicated Account Manager',
      'Weekly progress tracking',
    ],
    cta: 'Go All-In with Premium',
  },
];