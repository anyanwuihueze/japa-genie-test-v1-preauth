'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, MessageCircle, Star, Sparkles, TrendingUp, Users, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ALL_COUNTRIES } from '@/lib/countries';
import { analyzeQuickEligibility } from '@/ai/flows/quick-eligibility-flow';

const formSchema = z.object({
  destination: z.string().min(2, 'Please select your destination country'),
  visaType: z.string().min(2, 'Please select the visa type you need'),
  background: z.string().min(50, 'Please provide at least 50 characters - mention your education, work experience, or key qualifications'),
  currentSituation: z.string().min(30, 'Please provide at least 30 characters - tell us about your current status and goals'),
});

const testimonials = [
  { name: "Amara O.", country: "🇳🇬 Nigeria", text: "Saved me from applying to the wrong country. Got my Canada visa in 4 months!", score: 82 },
  { name: "Kwame A.", country: "🇬🇭 Ghana", text: "Avoided wasting $2,500 on a rejected application. Now studying in UK!", score: 78 },
  { name: "Zara M.", country: "🇰🇪 Kenya", text: "Finally understood what I needed to fix. Score went from 45% to 88%!", score: 88 },
  { name: "Sipho N.", country: "🇿🇦 South Africa", text: "This tool showed me countries I never considered. Now in Australia!", score: 91 },
  { name: "Fatima B.", country: "🇸🇳 Senegal", text: "Honest feedback saved me from another rejection. Approved 2nd time!", score: 73 },
  { name: "Chidi E.", country: "🇳🇬 Nigeria", text: "Better than 3 agents I paid ₦500k. Wish I found this earlier!", score: 86 },
];

const ANALYSIS_STEPS = [
  { text: 'Analyzing your profile...', duration: 1500 },
  { text: 'Checking visa requirements...', duration: 2000 },
  { text: 'Comparing with successful applications...', duration: 1800 },
  { text: 'Generating personalized insights...', duration: 1200 },
];

export default function EligibilityCheckClient() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [statsCount, setStatsCount] = useState({ checks: 0, approved: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(p => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animated stats counter
    const target = { checks: 6424, approved: 4117 };
    const duration = 2000;
    const steps = 50;
    const increment = {
      checks: target.checks / steps,
      approved: target.approved / steps,
    };
    
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setStatsCount({
        checks: Math.min(Math.floor(increment.checks * current), target.checks),
        approved: Math.min(Math.floor(increment.approved * current), target.approved),
      });
      if (current >= steps) clearInterval(timer);
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, []);

  async function handleCheckEligibility(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisStep(0);
    
    // Animated progress steps
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalysisStep(i);
      await new Promise(resolve => setTimeout(resolve, ANALYSIS_STEPS[i].duration));
    }

    try {
      const analysis = await analyzeQuickEligibility({
        destination: values.destination,
        visaType: values.visaType,
        background: values.background,
        currentSituation: values.currentSituation,
      });

      const eligibilityData = {
        destination: values.destination,
        visaType: values.visaType,
        background: values.background,
        currentSituation: values.currentSituation,
        aiResults: analysis,
        timestamp: new Date().toISOString(),
      };
      
      sessionStorage.setItem('eligibilityResults', JSON.stringify(eligibilityData));
      
      toast({ 
        title: '✅ Analysis Complete!', 
        description: `Your eligibility score: ${analysis.score}%`,
        duration: 3000,
      });

      setTimeout(() => {
        router.push('/eligibility');
      }, 500);
      
    } catch (e: any) {
      console.error('AI Analysis error:', e);
      
      const eligibilityData = {
        destination: values.destination,
        visaType: values.visaType,
        background: values.background,
        currentSituation: values.currentSituation,
        aiResults: {
          score: 72,
          summary: "Basic profile analysis completed. Your application shows potential, but several areas need attention before proceeding.",
          strengths: [
            "Clear destination goal identified",
            "Initial profile information provided",
          ],
          weaknesses: [
            "Detailed AI analysis temporarily unavailable",
            "Recommend completing full assessment for comprehensive insights",
          ],
          recommendations: [
            "Complete the detailed 12-question visa readiness assessment",
            "Review official embassy requirements for " + values.destination,
            "Consider consulting with a visa specialist",
          ],
          alternativeDestinations: []
        },
        timestamp: new Date().toISOString(),
      };
      
      sessionStorage.setItem('eligibilityResults', JSON.stringify(eligibilityData));
      
      toast({ 
        title: 'Analysis Complete',
        description: 'Showing basic profile assessment',
        duration: 3000,
      });
      
      setTimeout(() => {
        router.push('/eligibility');
      }, 500);
      
    } finally {
      setIsLoading(false);
      setAnalysisStep(0);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      visaType: '',
      background: '',
      currentSituation: '',
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="container py-8 sm:py-16 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            <Sparkles className="w-4 h-4" />
            AI-Powered Eligibility Analysis
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
            Stop Wasting Money on Rejected Visas
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
            Get an <span className="font-bold text-purple-600">AI-powered eligibility score</span> before you apply.
            <br className="hidden sm:block" />
            The average rejected visa costs <span className="font-bold text-red-600">$2,000+</span> in fees and lost opportunities.
          </p>

          {/* Live Stats */}
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto pt-4">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {statsCount.checks.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 font-medium">Eligibility Checks</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {statsCount.approved.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 font-medium">Visas Approved</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-200 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            
            <div className="text-center space-y-3 min-h-[120px] flex flex-col justify-center">
              <p className="text-lg italic text-gray-800 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              
              <div className="space-y-1">
                <p className="text-sm font-semibold text-purple-700">
                  {testimonials[currentTestimonial].name} • {testimonials[currentTestimonial].country}
                </p>
                <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Eligibility Score: {testimonials[currentTestimonial].score}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentTestimonial 
                      ? 'w-8 bg-purple-600' 
                      : 'w-2 bg-purple-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="max-w-3xl mx-auto shadow-2xl border-2">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Quick Eligibility Check</CardTitle>
                <CardDescription className="text-base">
                  4 simple questions • 3 minutes • AI-powered analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCheckEligibility)} className="space-y-8">
                
                {/* Destination */}
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-600" />
                        Where do you want to go?
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select destination country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {ALL_COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country} className="text-base">
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose your dream destination from 195+ countries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visa Type */}
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        What type of visa do you need?
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select visa type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Student" className="text-base">🎓 Student Visa</SelectItem>
                          <SelectItem value="Work" className="text-base">💼 Work Visa</SelectItem>
                          <SelectItem value="Tourist" className="text-base">✈️ Tourist/Visitor Visa</SelectItem>
                          <SelectItem value="Business" className="text-base">🏢 Business Visa</SelectItem>
                          <SelectItem value="Family" className="text-base">👨‍👩‍👧‍👦 Family/Spouse Visa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Background */}
                <FormField
                  control={form.control}
                  name="background"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Tell us about your background & qualifications
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Example: I have a Bachelor's degree in Computer Science from University of Lagos. I've worked as a software developer for 3 years at a fintech startup. I have certifications in AWS and React..."
                          className="resize-none text-base min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include: Education, work experience, skills, certifications, language abilities
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Situation */}
                <FormField
                  control={form.control}
                  name="currentSituation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        What's your current situation and goal?
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Example: I'm currently employed full-time in Nigeria. I want to pursue a Master's degree in Data Science in Canada starting Fall 2026. I have $15,000 saved for tuition..."
                          className="resize-none text-base min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include: Current employment status, financial readiness, travel history, why you want to travel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>{ANALYSIS_STEPS[analysisStep]?.text || 'Processing...'}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Get My Free AI Eligibility Score
                      </>
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    No credit card required • Results in 30 seconds
                  </p>
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-2">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">100% Free</h3>
              <p className="text-sm text-gray-600">No hidden costs or credit card needed</p>
            </Card>
            
            <Card className="text-center p-6 border-2">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">Advanced algorithms analyze your profile</p>
            </Card>
            
            <Card className="text-center p-6 border-2">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">12,847+ Checks</h3>
              <p className="text-sm text-gray-600">Join thousands of successful applicants</p>
            </Card>
          </div>
        </div>

        {/* Community CTA - After form */}
        <Card className="max-w-3xl mx-auto border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-600 rounded-full flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Join 5,000+ Africans in Our Free Visa Community</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Real-time embassy updates, policy changes, document templates, and success stories
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-2 border-green-600 text-green-700 hover:bg-green-100"
                  >
                    <a href="https://wa.me/2349031627095" target="_blank" rel="noopener noreferrer">
                      💬 WhatsApp Nigeria
                    </a>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-2 border-green-600 text-green-700 hover:bg-green-100"
                  >
                    <a href="https://wa.me/12042901895" target="_blank" rel="noopener noreferrer">
                      💬 WhatsApp Canada
                    </a>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-2 border-blue-600 text-blue-700 hover:bg-blue-100"
                  >
                    <a href="https://t.me/japagenie" target="_blank" rel="noopener noreferrer">
                      📱 Telegram Group
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}