import { HeroSection } from '@/components/landing/hero-section';

export const metadata = {
  title: 'Japa Genie — AI-Powered Immigration Assistant for Africans',
  description: 'Japa Genie helps Africans navigate visa applications with AI. Get personalised visa advice, proof of funds analysis, cost calculations and eligibility checks for UK, Canada, Germany, Japan and 20+ destinations.',
  openGraph: {
    title: 'Japa Genie — AI-Powered Immigration Assistant for Africans',
    description: 'Japa Genie helps Africans navigate visa applications with AI. Get personalised visa advice, proof of funds analysis, cost calculations and eligibility checks for UK, Canada, Germany, Japan and 20+ destinations.',
    url: 'https://japagenie.com',
    siteName: 'Japa Genie',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Japa Genie — AI-Powered Immigration Assistant for Africans',
    description: 'Japa Genie helps Africans navigate visa applications with AI. Get personalised visa advice, proof of funds analysis, cost calculations and eligibility checks for UK, Canada, Germany, Japan and 20+ destinations.',
  },
  alternates: {
    canonical: 'https://japagenie.com',
  }
};


import LandingClient from '@/components/landing/landing-client';

export default function Home() {
  return (
    <>
      <HeroSection />
      <LandingClient />
    </>
  );
}
