'use client';

import { useEffect, useState } from 'react';
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

  // ✅ FIXED: interval inside useEffect – no hydration error
  useEffect(() => {
    const i = setInterval(() => setCurrentTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(i);
  }, []);

  async function handleCheckEligibility(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulate API
      toast({ title: 'Eligibility Check Complete!', description: 'Redirecting you to your personalized results...' });
      const params = new URLSearchParams({
        destination: values.destination,
        visaType: values.visaType,
        background: values.background.substring(0, 100),
        situation: values.currentSituation.substring(0, 100),
      });
      router.push(`/eligibility-results?${params.toString()}`);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  }

  /*  =====  REST OF YOUR ORIGINAL JSX HERE  =====  */
  return (
    <div className="space-y-12">
      {/* Hero + testimonials + form – unchanged */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Stop Applying Blindly. Check Your Eligibility First.</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          The average rejected visa costs <span className="font-bold text-red-600">$2,000</span> in fees + lost opportunities.
        </p>
      </div>

      {/* WhatsApp CTA – unchanged */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full"><MessageCircle className="h-6 w-6 text-green-600" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Join 5,000+ Africans Getting Real-Time Visa Updates</h3>
                <p className="text-sm text-muted-foreground mb-4">New embassy requirements, policy changes, success stories — all in our free community.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-100"><a href="https://wa.me/2349031627095" target="_blank" rel="noopener noreferrer">🇳🇬 WhatsApp (Nigeria)</a></Button>
                  <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-100"><a href="https://wa.me/12042901895" target="_blank" rel="noopener noreferrer">🇨🇦 WhatsApp (Canada)</a></Button>
                  <Button asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-100"><a href="https://t.me/japagenie" target="_blank" rel="noopener noreferrer">Join Telegram Group</a></Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----  FORM  ---- */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Quick Eligibility Check</CardTitle>
          <CardDescription>3-minute quiz, no signup required</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...useForm({ resolver: zodResolver(formSchema), defaultValues: { destination: '', visaType: '', background: '', currentSituation: '' } })}>
            <form onSubmit={useForm().handleSubmit(handleCheckEligibility)} className="space-y-6">
              {/* Destination */}
              <FormField name="destination" render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="USA">United States</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Visa Type */}
              <FormField name="visaType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Visa type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select visa" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Tourist">Tourist</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Background */}
              <FormField name="background" render={({ field }) => (
                <FormItem>
                  <FormLabel>Background & qualifications</FormLabel>
                  <FormControl><Textarea placeholder="Describe your education, work experience..." className="resize-none" rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Current Situation */}
              <FormField name="currentSituation" render={({ field }) => (
                <FormItem>
                  <FormLabel>Current situation</FormLabel>
                  <FormControl><Textarea placeholder="What are you doing now? Why do you want to travel?" className="resize-none" rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking...</> : <><CheckCircle2 className="mr-2 h-4 w-4" />Check My Eligibility</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Rotating testimonial – auto-rotates every 4 s */}
      <Card className="max-w-3xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="pt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-purple-700">Real Success Stories</span>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-lg italic text-purple-900">“{testimonials[currentTestimonial].text}”</p>
          <p className="text-sm text-purple-700 mt-2">— {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].country}</p>
        </CardContent>
      </Card>
    </div>
  );
}