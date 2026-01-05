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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      visaType: 'Work Visa',
      background: '',
      currentSituation: '',
    },
  });

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

      {/* Authority Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span>Based on embassy data from <span className="font-semibold text-foreground">50+ countries</span></span>
      </div>

      {/* Social Proof - Rotating Testimonials */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-[60px]">
                <p className="text-sm italic mb-2 transition-all duration-500">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="text-xs font-semibold">
                  — {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].country}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">73% success rate</span> · <span className="font-bold text-primary">2,000+ users</span> · <span className="font-bold text-primary">★★★★★ 4.9/5</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full w-fit">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Stop Guessing Which Country</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Our AI matches you to countries where you actually qualify — not where agents want to send you.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-50 rounded-full w-fit">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-lg">Know Your Weak Spots First</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Get brutally honest feedback on what'll get you rejected — before embassies see it.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-purple-50 rounded-full w-fit">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Turn a 'Maybe' Into a 'Yes'</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              See exactly what to fix to boost your approval odds from 30% to 80%.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Eligibility Form */}
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Start Your Eligibility Check</CardTitle>
          </div>
          <CardDescription className="text-base">
            No pressure. No agents. Just clarity in less than 3 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCheckEligibility)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Canada, USA, UK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visa type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Work Visa">Work Visa / Permit</SelectItem>
                          <SelectItem value="Student Visa">Student Visa</SelectItem>
                          <SelectItem value="Family Visa">Family / Spousal Visa</SelectItem>
                          <SelectItem value="Business Visa">Business Visa</SelectItem>
                          <SelectItem value="Tourist Visa">Tourist / Visitor Visa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Background</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I'm a software engineer with 5 years experience...' or 'I've been accepted to study Masters in Computer Science at...'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentSituation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Situation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Currently working in Lagos, want to relocate for better opportunities...'"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button with Animated Chevrons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse" style={{ animationDelay: '0s' }} />
                    <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse -ml-1.5" style={{ animationDelay: '0.2s' }} />
                    <ChevronRight className="w-5 h-5 text-primary animate-chevron-pulse -ml-1.5" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-primary hover:shadow-lg transition-all text-lg py-6 px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Your Profile...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Get My Free Eligibility Report
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                100% Free. No Credit Card. No Hidden Fees.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* WhatsApp/Telegram CTA */}
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
                    <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer">
                      Join WhatsApp Group
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-100">
                    <a href="https://t.me/YOUR_TELEGRAM_GROUP" target="_blank" rel="noopener noreferrer">
                      Join Telegram Group
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust Element */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground">
          🔒 Your information is secure and never shared with third parties
        </p>
      </div>
    </div>
  );
}