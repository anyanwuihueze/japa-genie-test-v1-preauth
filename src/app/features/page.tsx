import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Target, BarChart, Clock, CheckCircle, Building2, Users, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'AI Visa Matchmaker',
    description: 'Get matched to countries with highest acceptance rates for YOUR specific profile, qualifications, and budget.',
  },
  {
    icon: BarChart,
    title: 'Real-Time Success Rates',
    description: 'Live data on visa acceptance rates, processing times, and costs updated by our AI agents daily.',
  },
  {
    icon: Clock,
    title: 'Visual Progress Tracking',
    description: 'See exactly where you are in your journey with our interactive progress map. No more guessing.',
  },
  {
    icon: CheckCircle,
    title: '24/7 AI Guidance',
    description: 'Get instant answers to your visa questions. No more waiting for consultants or outdated forums.',
  },
  {
    icon: Building2,
    title: 'Jobs in Demand',
    description: 'Discover which skills are most wanted in your target countries and how to position yourself.',
  },
  {
    icon: Users,
    title: 'Rejection Recovery',
    description: 'Been rejected before? Our AI analyzes why and creates a comeback strategy that works.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Everything You Need to Succeed
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Built specifically for African professionals who refuse to settle for rejection.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link href="/chat" key={index} className="block group">
                <Card className="flex flex-col text-center items-center p-8 transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                  <div className="mb-4 bg-primary/10 text-primary rounded-full p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-gradient-to-r from-amber-400 to-primary text-primary-foreground hover:shadow-lg transition-shadow rounded-full px-10 py-6 text-lg font-bold">
            <Link href="/chat">
              Get Answers Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
