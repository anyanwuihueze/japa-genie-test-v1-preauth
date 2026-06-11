import { MetadataRoute } from 'next';

const visaGuidePages = [
  'ethiopia-to-uk',
  'ghana-to-canada',
  'ghana-to-germany',
  'ghana-to-uk',
  'kenya-to-canada',
  'kenya-to-germany',
  'kenya-to-uk',
  'nigeria-to-australia',
  'nigeria-to-canada',
  'nigeria-to-finland',
  'nigeria-to-germany',
  'nigeria-to-ireland',
  'nigeria-to-japan',
  'nigeria-to-netherlands',
  'nigeria-to-portugal',
  'nigeria-to-uae',
  'nigeria-to-uk',
  'south-africa-to-canada',
  'south-africa-to-uk',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const visaGuideEntries = visaGuidePages.map((slug) => ({
    url: `https://japagenie.com/visa-guide/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://japagenie.com',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: 'https://japagenie.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://japagenie.com/blog/japan-truck-driver-visa',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://japagenie.com/blog/schengen-back-door-strategy',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://japagenie.com/blog/cape-verde-launchpad',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://japagenie.com/blog/rejection-risk-score',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://japagenie.com/blog/amara-visa-rejection-reversal',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://japagenie.com/blog/kwame-teacher-to-uk-global-talent',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://japagenie.com/pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://japagenie.com/experts',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://japagenie.com/chat',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://japagenie.com/cost-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://japagenie.com/visa-matchmaker',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...visaGuideEntries,
  ];
}