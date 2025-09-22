import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FileInput, Sparkles, Plane, BarChart, Bot, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: UserPlus,
    title: '1. Tell Us About Yourself',
    description: 'Provide your background, intended destination, and budget. The more details you share, the more personalized your visa roadmap will be.',
  },
  {
    icon: Sparkles,
    title: '2. Get AI-Powered Insights',
    description: "Our AI, Japa Genie, analyzes your profile to generate personalized visa recommendations, cost estimates, and approval chances in seconds.",
  },
  {
    icon: BarChart,
    title: '3. Compare & Choose Your Path',
    description: 'Use our interactive dashboard to compare visa options. Sort by cost, processing time, or success rate to find the perfect fit for you.',
  },
  {
    icon: FileInput,
    title: '4. Check Your Documents',
    description: 'Upload your application documents, and our AI will scan them for errors, missing information, and formatting issues, helping prevent costly delays.',
  },
  {
    icon: Bot,
    title: '5. Ask Our AI Assistant',
    description: 'Have questions anytime? Our AI Chat Assistant is available 24/7 to provide instant answers about any part of the visa process.',
  },
  {
    icon: Plane,
    title: '6. Apply with Confidence',
    description: 'With your personalized roadmap and verified documents, you can submit your visa application with peace of mind. Your journey awaits!',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How Japa Genie Works</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          From personalized recommendations to document verification, we simplify every step of your visa application journey.
        </p>
      </header>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <Card key={index} className="transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-4 rounded-full">
                    <step.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                        {step.description}
                    </CardDescription>
                </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="text-center py-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-muted-foreground mb-6">Let Japa Genie be your trusted guide.</p>
        <Button asChild size="lg">
          <Link href="/chat">Get Started Now <Sparkles className="ml-2 w-4 h-4" /></Link>
        </Button>
      </div>
    </div>
  );
}
