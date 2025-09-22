'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageCircleQuestion, CheckCircle2, Map, Repeat, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';


const features = [
  {
    icon: MessageCircleQuestion,
    title: 'Start a Mock Interview',
    description: 'Practice with realistic, AI-generated questions to build confidence and ace your real interview.',
    href: '/interview',
    cta: 'Start Practicing',
  },
  {
    icon: CheckCircle2,
    title: 'Check a Document',
    description: 'Upload your documents and let our AI scan for errors, missing info, and formatting issues to prevent delays.',
    href: '/document-check',
    cta: 'Analyze Document',
  },
  {
    icon: Map,
    title: 'View Your Visa Journey',
    description: 'See the detailed step-by-step timeline for your entire application process.',
    href: '/progress',
    cta: 'View Journey',
  },
  {
    icon: Repeat,
    title: 'Visa Rejection Reversal',
    description: 'Turn a past rejection into a success story with an AI-powered comeback strategy tailored to your case.',
    href: '/rejection-reversal',
    cta: 'Get Strategy',
  },
];

export default function ProgressMapClient() {
  const progressPercentage = 40; // This would be dynamic in a real app

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Your Progress Map</h1>
        <p className="text-lg text-muted-foreground">
          Your personalized AI guide to visa success. Here's your journey at a glance.
        </p>
      </header>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-xl">Overall Progress</CardTitle>
                <Badge variant="secondary">{progressPercentage}% Complete</Badge>
            </div>
            <CardDescription>You're well on your way! Keep up the momentum.</CardDescription>
        </CardHeader>
        <CardContent>
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Application Start</span>
                <span>Visa Approval</span>
            </div>
        </CardContent>
      </Card>


      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col group hover:border-primary transition-all">
            <CardHeader className="flex-1">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className='flex-1'>
                  <CardTitle className="text-xl mb-1">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="p-6 pt-0">
               <Button asChild className="w-full group-hover:bg-amber-400 transition-colors">
                    <Link href={feature.href}>
                        {feature.cta} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
