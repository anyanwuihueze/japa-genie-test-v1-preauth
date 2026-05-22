const fs = require('fs');

const pages = [
  {
    path: 'src/app/page.tsx',
    title: 'Japa Genie — AI-Powered Immigration Assistant for Africans',
    description: 'Japa Genie helps Africans navigate visa applications with AI. Get personalised visa advice, proof of funds analysis, cost calculations and eligibility checks for UK, Canada, Germany, Japan and 20+ destinations.',
    url: 'https://japagenie.com',
  },
  {
    path: 'src/app/pricing/page.tsx',
    title: 'Pricing — Japa Genie AI Immigration Assistant',
    description: 'Get unlimited AI visa guidance from as little as $11. No more paying $3,000 consultants for generic advice. Choose the plan that fits your immigration timeline.',
    url: 'https://japagenie.com/pricing',
  },
  {
    path: 'src/app/blog/page.tsx',
    title: 'Japa News — Immigration Insights for Africans | Japa Genie',
    description: 'Real immigration stories, hidden visa pathways, and actionable guides for Africans navigating UK, Canada, Europe, Japan and beyond.',
    url: 'https://japagenie.com/blog',
  },
  {
    path: 'src/app/experts/page.tsx',
    title: 'Expert Immigration Help for Africans | Japa Genie',
    description: 'Connect with verified immigration experts who specialise in African visa applications. Get professional guidance for complex cases.',
    url: 'https://japagenie.com/experts',
  }
];

const metadataBlock = (title, description, url) => `
export const metadata = {
  title: '${title}',
  description: '${description}',
  openGraph: {
    title: '${title}',
    description: '${description}',
    url: '${url}',
    siteName: 'Japa Genie',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title}',
    description: '${description}',
  },
  alternates: {
    canonical: '${url}',
  }
};

`;

pages.forEach(page => {
  if (!fs.existsSync(page.path)) {
    console.log('SKIP - not found:', page.path);
    return;
  }

  let content = fs.readFileSync(page.path, 'utf8');

  if (content.includes('export const metadata')) {
    console.log('SKIP - already exists:', page.path);
    return;
  }

  // Insert metadata after first line ('use client' or import)
  const lines = content.split('\n');
  const insertAfter = lines[0].includes("'use client'") ? 1 : 0;
  lines.splice(insertAfter + 1, 0, metadataBlock(page.title, page.description, page.url));
  content = lines.join('\n');

  fs.writeFileSync(page.path, content);
  console.log('DONE:', page.path);
});
