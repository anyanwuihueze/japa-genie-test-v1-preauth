'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, MapPin, TrendingUp, FileCheck, ShieldCheck, Star, ChevronRight, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  destination: z.string().min(2, 'Destination country is required.'),
  visaType: z.string().min(2, 'Visa type is required.'),
  background: z.string().min(20, 'Please provide more details about your background.'),
  currentSituation: z.string().min(10, 'Please briefly describe your current situation.'),
});

// Pan-African testimonials
const testimonials = [
  { name: "Amara O.", country: "Nigeria", text: "Saved me from applying to the wrong country. Got my Canada visa!" },
  { name: "Kwame A.", country: "Ghana", text: "Avoided wasting $2,500 on a rejected application. Now studying in UK!" },
  { name: "Zara M.", country: "Kenya", text: "Finally understood what I needed to fix. Got approved 3 months later!" },
  { name: "Sipho N.", country: "South Africa", text: "This tool showed me countries I never considered. Now in Australia!" },
  { name: "Fatima B.", country: "Senegal", text: "Honest feedback saved me from another rejection. Merci!" },
  { name: "Chidi E.", country: "Nigeria", text: "Better than 3 agents I paid. Wish I found this earlier!" },
];

export default function EligibilityCheckClient() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Rotate testimonials every 4 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  });

  async function handleCheckEligibility(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Simulate API call - in production, this would call your eligibility check endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Eligibility Check Complete!',
        description: 'Redirecting you to your personalized results...',
      });
      
      // Redirect to results page with form data
      const params = new URLSearchParams({
        destination: values.destination,
        visaType: values.visaType,
        background: values.background.substring(0, 100), // Limit URL length
        situation: values.currentSituation.substring(0, 100),
      });
      
      router.push(`/eligibility-results?${params.toString()}`);
      
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* Hero Section with Loss Aversion */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Stop Applying Blindly. Check Your Eligibility First.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          The average rejected visa costs <span className="font-bold text-red-600">$2,000</span> in fees + lost opportunities.
        </p>
        <p className="text-base text-muted-foreground">
          Avoid the <span className="font-bold text-red-600">₦150,000 agent scam</span>. Check eligibility yourself in 3 minutes.
        </p>
      </div>

      {/* WhatsApp CTA - FIXED */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Join 5,000+ Africans Getting Real-Time Visa Updates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  New embassy requirements, policy changes, success stories — all in our free community.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                    <a href="https://wa.me/2349031627095" target="_blank" rel="noopener noreferrer">
                      🇳🇬 WhatsApp (Nigeria)
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                    <a href="https://wa.me/12042901895" target="_blank" rel="noopener noreferrer">
                      🇨🇦 WhatsApp (Canada)
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-100">
                    <a href="https://t.me/japagenie" target="_blank" rel="noopener noreferrer">
                      Join Telegram Group
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rest of your form components... */}
      {/* [Keep your existing form code here] */}
    </div>
  );
}
