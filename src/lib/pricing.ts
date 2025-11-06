
export const subscriptionTiers = [
  {
    name: 'Pro',
    price: 20,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h', // Placeholder
    frequency: '/month',
    duration: 'Monthly Subscription',
    description: 'For ongoing support and peace of mind.',
    features: [
      'Everything in one-time plans',
      'Continuous access',
      'Priority email support',
      'Cancel anytime',
    ],
    cta: 'Subscribe to Pro',
    popular: true,
  },
  {
    name: 'Premium',
    price: 40,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h', // Placeholder
    frequency: '/month',
    duration: 'Monthly Subscription',
    description: 'For those who want expert human help.',
    features: [
      'Everything in Pro, plus:',
      'Verified Agent Consultation (separate fee)',
      '1-on-1 Onboarding Call',
      'Dedicated Account Manager',
    ],
    cta: 'Subscribe to Premium',
    popular: false,
  },
];

export const oneTimeCredits = [
  {
    name: '1 Week Access',
    price: 10,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h', // Placeholder
    duration: '7-day access',
    description: 'Perfect for a quick, focused effort.',
    features: [
      'Unlimited AI Wishes',
      'Full Access to All Tools',
      'Document Checker',
      'Mock Interviews',
    ],
    cta: 'Purchase for $10',
  },
  {
    name: '2 Weeks Access',
    price: 15,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h', // Placeholder
    duration: '14-day access',
    description: 'Great for getting your application ready.',
    features: [
      'Unlimited AI Wishes',
      'Full Access to All Tools',
      'Document Checker',
      'Mock Interviews',
    ],
    cta: 'Purchase for $15',
  },
  {
    name: '3 Weeks Access',
    price: 25,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h', // Placeholder
    duration: '21-day access',
    description: 'For a comprehensive review.',
    features: [
      'Unlimited AI Wishes',
      'Full Access to All Tools',
      'Document Checker',
      'Mock Interviews',
    ],
    cta: 'Purchase for $25',
  },
  {
    name: '4 Weeks Access',
    price: 30,
    priceId: 'price_1PX2hYRxp7zXO3s9o2r5dC0h', // Placeholder
    duration: '28-day access',
    description: 'The best value for a full month.',
    features: [
      'Unlimited AI Wishes',
      'Full Access to All Tools',
      'Document Checker',
      'Mock Interviews',
    ],
    cta: 'Purchase for $30',
  },
];

// Combined list for pages that show all plans
export const allPlans = [...oneTimeCredits.slice(0,1), ...subscriptionTiers, ...oneTimeCredits.slice(1)];
