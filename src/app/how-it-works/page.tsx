import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FileInput, Sparkles, Plane, BarChart, Bot, CheckCircle, Users, ShieldCheck, Calculator } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: UserPlus,
    title: '1. Tell Us About Yourself',
    description: 'Provide your background, intended destination, and budget. The more details you share, the more personalized your visa roadmap will be.',
  },
  {
    icon: Calculator,
    title: '2. Get Proof of Funds Plan',
    description: 'We calculate exactly how much money you need based on embassy policies and create a step-by-step plan for your financial documentation.',
  },
  {
    icon: Sparkles,
    title: '3. Get AI-Powered Insights',
    description: "Our AI, Japa Genie, analyzes your profile to generate personalized visa recommendations, cost estimates, and approval chances in seconds.",
  },
  {
    icon: BarChart,
    title: '4. Compare & Choose Your Path',
    description: 'Use our interactive dashboard to compare visa options. Sort by cost, processing time, or success rate to find the perfect fit for you.',
  },
  {
    icon: FileInput,
    title: '5. Check Your Documents',
    description: 'Upload your application documents, and our AI will scan them for errors, missing information, and formatting issues, helping prevent costly delays.',
  },
  {
    icon: Bot,
    title: '6. Ask Our AI Assistant',
    description: 'Have questions anytime? Our AI Chat Assistant is available 24/7 to provide instant answers about any part of the visa process.',
  },
  {
    icon: Users,
    title: '7. Get Human Expert Backup',
    description: 'For complex cases or when you need extra confidence, connect with our verified visa consultants for 1-on-1 guidance and document review.',
    highlight: true
  },
  {
    icon: Plane,
    title: '8. Apply with Confidence',
    description: 'With your personalized roadmap, verified documents, and expert support, you can submit your visa application with peace of mind. Your journey awaits!',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How Japa Genie Works</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          From personalized recommendations to expert human guidance, we simplify every step of your visa application journey.
        </p>
      </header>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <Card 
            key={index} 
            className={`transition-all hover:shadow-lg hover:border-primary/50 ${
              step.highlight ? 'border-2 border-orange-200 bg-orange-50/50' : ''
            }`}
          >
            <CardHeader className="flex flex-col md:flex-row items-start gap-6">
                <div className={`flex-shrink-0 p-4 rounded-full ${
                  step.highlight 
                    ? 'bg-orange-100 text-orange-600 border-2 border-orange-200' 
                    : 'bg-primary/10 text-primary'
                }`}>
                    <step.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{step.title}</CardTitle>
                      {step.highlight && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                          Expert Help Available
                        </span>
                      )}
                    </div>
                    <CardDescription className="mt-2 text-base">
                        {step.description}
                    </CardDescription>
                </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Enhanced CTA Section */}
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <h2 className="text-3xl font-bold mb-4">Start Your Visa Journey Today</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you need AI guidance or human expert support, Japa Genie has you covered. 
            Get personalized proof of funds calculations, document reviews, and interview coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-400 to-primary text-primary-foreground hover:shadow-lg transition-shadow">
              <Link href="/chat">
                Start with AI Assistant <Sparkles className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              <Link href="/experts">
                Connect with Human Experts <Users className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ✅ Free AI assistance • ✅ Verified experts • ✅ Money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}