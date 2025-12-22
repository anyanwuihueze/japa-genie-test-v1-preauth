
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PriorityProcessingPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent">
          Fast-Track Your Visa Application
        </h1>
        <p className="text-lg text-muted-foreground">
          Visa processing can be slow and unpredictable. Discover insider strategies and official programs to reduce your wait time and get your decision faster.
        </p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Zap className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <CardTitle>Official Expedited Programs</CardTitle>
                    <CardDescription>Identify if your destination country offers premium processing services (like the US Premium Processing) and learn how to qualify and apply for them.</CardDescription>
                </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Clock className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <CardTitle>Strategic Application Timing</CardTitle>
                    <CardDescription>Avoid peak submission periods. We analyze historical data to recommend the best months to apply for quicker turnaround times at specific embassies.</CardDescription>
                </div>
            </div>
          </CardHeader>
        </Card>
         <Card className="flex flex-col">
          <CardHeader className="flex-1">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Shield className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <CardTitle>Flawless Application Method</CardTitle>
                    <CardDescription>A perfectly prepared, error-free application is less likely to face delays. Use our Document Checker to ensure your submission is pristine from day one.</CardDescription>
                </div>
            </div>
          </CardHeader>
        </Card>
         <Card className="flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <ArrowRight className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <CardTitle>Direct Consular Follow-up</CardTitle>
                    <CardDescription>Learn the professional and correct way to inquire about your case status after the standard processing time has passed, without jeopardizing your application.</CardDescription>
                </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="text-center bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Ready to Speed Things Up?</CardTitle>
          <CardDescription className="mb-4">Let Japa Genie build a personalized priority roadmap for you.</CardDescription>
          <Button asChild>
            <Link href="/kyc">Get My Priority Plan</Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
