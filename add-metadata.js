const fs = require('fs');

const posts = [
  {
    path: 'src/app/blog/japan-truck-driver-visa/page.tsx',
    title: 'Japan Is Hiring African Truck Drivers — SSW Visa Guide 2025 | Japa Genie',
    description: 'Japan needs 270,000 truck drivers by 2030 and is actively recruiting Africans. Complete guide to the Japan SSW visa for Nigerian and African applicants.',
    url: 'https://japagenie.com/blog/japan-truck-driver-visa',
    fn: 'JapanTruckDriverVisa'
  },
  {
    path: 'src/app/blog/schengen-back-door-strategy/page.tsx',
    title: 'The Schengen Back Door Strategy for Africans — Europe to Canada 2025 | Japa Genie',
    description: 'UK and Canada are closing doors but smart Africans are using a two-step Schengen strategy to reach Europe and beyond. Full pathway guide inside.',
    url: 'https://japagenie.com/blog/schengen-back-door-strategy',
    fn: 'SchengenBackDoorStrategy'
  },
  {
    path: 'src/app/blog/cape-verde-launchpad/page.tsx',
    title: 'Cape Verde: Africa\'s Launchpad to Europe — Residency Guide 2025 | Japa Genie',
    description: 'Cape Verde offers Nigerian passport holders visa-free entry and a residency pathway that leads directly to Portugal and EU citizenship. Full guide inside.',
    url: 'https://japagenie.com/blog/cape-verde-launchpad',
    fn: 'CapeVerdeLaunchpad'
  },
  {
    path: 'src/app/blog/rejection-risk-score/page.tsx',
    title: 'How Japa Genie Calculates Your Visa Rejection Risk Score | Japa Genie',
    description: 'Discover the 7 hidden factors embassies check that cause 68% of visa rejections. Learn how to fix your risk score before you apply.',
    url: 'https://japagenie.com/blog/rejection-risk-score',
    fn: null
  },
  {
    path: 'src/app/blog/amara-visa-rejection-reversal/page.tsx',
    title: 'From 3 Rejections to Canadian PR: Amara\'s Story | Japa Genie',
    description: 'How an Ivorian software engineer reversed three Canadian visa rejections using AI-powered analysis to land a CAD $85,000 job in Toronto.',
    url: 'https://japagenie.com/blog/amara-visa-rejection-reversal',
    fn: 'AmaraStory'
  },
  {
    path: 'src/app/blog/kwame-teacher-to-uk-global-talent/page.tsx',
    title: 'From Rural Ghana Teacher to UK Global Talent Visa | Japa Genie',
    description: 'How a rural Ghana teacher used an innovative EdTech approach to qualify for the UK Global Talent visa and land a £65,000 salary in London.',
    url: 'https://japagenie.com/blog/kwame-teacher-to-uk-global-talent',
    fn: null
  }
];

posts.forEach(post => {
  if (!fs.existsSync(post.path)) {
    console.log('SKIP - file not found:', post.path);
    return;
  }

  let content = fs.readFileSync(post.path, 'utf8');

  const metadata = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${post.title}',
  description: '${post.description}',
  openGraph: {
    title: '${post.title}',
    description: '${post.description}',
    url: '${post.url}',
    siteName: 'Japa Genie',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${post.title}',
    description: '${post.description}',
  },
  alternates: {
    canonical: '${post.url}',
  }
};

`;

  if (content.includes("export const metadata")) {
    console.log('SKIP - metadata already exists:', post.path);
    return;
  }

  // Add metadata before the default export
  content = content.replace("import { Button }", metadata + "import { Button }");
  fs.writeFileSync(post.path, content);
  console.log('DONE:', post.path);
});
