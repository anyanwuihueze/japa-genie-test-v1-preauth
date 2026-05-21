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
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, Sparkles, Loader2, Plane, MapPin, Users, Calendar, 
  TrendingUp, AlertCircle, DollarSign, CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  originCountry: z.string().min(1, 'Please select your origin country'),
  destinationCountry: z.string().min(1, 'Please select destination country'),
  visaType: z.string().min(1, 'Please select visa type'),
  dependents: z.string().default('0'),
  travelDate: z.string().optional(),
});

const COUNTRIES = [
  { value: 'Nigeria', label: '��🇬 Nigeria' },
  { value: 'Ghana', label: '🇬🇭 Ghana' },
  { value: 'Kenya', label: '🇰🇪 Kenya' },
  { value: 'South Africa', label: '🇿🇦 South Africa' },
  { value: 'India', label: '🇮🇳 India' },
  { value: 'Pakistan', label: '🇵🇰 Pakistan' },
  { value: 'Bangladesh', label: '🇧🇩 Bangladesh' },
  { value: 'Philippines', label: '🇵🇭 Philippines' },
  { value: 'Egypt', label: '🇪🇬 Egypt' },
  { value: 'Morocco', label: '🇲🇦 Morocco' },
  { value: 'Brazil', label: '🇧🇷 Brazil' },
  { value: 'Mexico', label: '🇲🇽 Mexico' },
  { value: 'Argentina', label: '🇦🇷 Argentina' },
  { value: 'Colombia', label: '🇨🇴 Colombia' },
  { value: 'Turkey', label: '🇹🇷 Turkey' },
  { value: 'United States', label: '🇺🇸 United States' },
  { value: 'Canada', label: '🇨🇦 Canada' },
  { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
  { value: 'Australia', label: '🇦🇺 Australia' },
  { value: 'Germany', label: '🇩🇪 Germany' },
  { value: 'France', label: '🇫🇷 France' },
  { value: 'Netherlands', label: '🇳🇱 Netherlands' },
  { value: 'Sweden', label: '🇸🇪 Sweden' },
  { value: 'Norway', label: '🇳🇴 Norway' },
  { value: 'Denmark', label: '🇩🇰 Denmark' },
  { value: 'Switzerland', label: '🇨🇭 Switzerland' },
  { value: 'Austria', label: '🇦🇹 Austria' },
  { value: 'Ireland', label: '🇮🇪 Ireland' },
  { value: 'New Zealand', label: '🇳🇿 New Zealand' },
  { value: 'Japan', label: '🇯🇵 Japan' },
  { value: 'South Korea', label: '🇰🇷 South Korea' },
  { value: 'Singapore', label: '🇸🇬 Singapore' },
  { value: 'UAE', label: '🇦🇪 UAE' },
  { value: 'Saudi Arabia', label: '🇸🇦 Saudi Arabia' },
  { value: 'China', label: '🇨🇳 China' },
  { value: 'Russia', label: '🇷🇺 Russia' },
  { value: 'Ukraine', label: '🇺🇦 Ukraine' },
  { value: 'Poland', label: '🇵�� Poland' },
  { value: 'Czech Republic', label: '🇨🇿 Czech Republic' },
  { value: 'Hungary', label: '🇭🇺 Hungary' },
  { value: 'Portugal', label: '🇵🇹 Portugal' },
  { value: 'Spain', label: '🇪🇸 Spain' },
  { value: 'Italy', label: '🇮🇹 Italy' },
  { value: 'Greece', label: '🇬🇷 Greece' },
  { value: 'Belgium', label: '🇧🇪 Belgium' },
  { value: 'Finland', label: '🇫🇮 Finland' },
  { value: 'Israel', label: '🇮🇱 Israel' },
  { value: 'Malaysia', label: '🇲🇾 Malaysia' },
  { value: 'Thailand', label: '🇹🇭 Thailand' },
  { value: 'Indonesia', label: '🇮🇩 Indonesia' },
  { value: 'Vietnam', label: '🇻🇳 Vietnam' },
  { value: 'Other', label: '🌍 Other Country' },
];

const VISA_TYPES = [
  { value: 'Student', label: '🎓 Student Visa' },
  { value: 'Work', label: '💼 Work Visa' },
  { value: 'Tourist', label: '✈️ Tourist Visa' },
  { value: 'Business', label: '💼 Business Visa' },
  { value: 'Family', label: '👨‍👩‍👧‍👦 Family Reunion' },
  { value: 'Skilled Worker', label: '🎯 Skilled Worker' },
  { value: 'Digital Nomad', label: '💻 Digital Nomad' },
  { value: 'Investor', label: '💰 Investor Visa' },
  { value: 'Startup', label: '🚀 Startup Visa' },
  { value: 'Job Seeker', label: '🔍 Job Seeker' },
];

export default function TrueVisaCostCalculatorForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const loadingMessages = [
    'Researching visa requirements...',
    'Calculating hidden costs...',
    'Building your POF timeline...',
    'Analyzing route-specific fees...',
    'Generating savings roadmap...',
    'Almost ready...',
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originCountry: '',
      destinationCountry: '',
      visaType: '',
      dependents: '0',
      travelDate: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setLoadingMessage(loadingMessages[0]);
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[msgIndex]);
    }, 2000);
    setTimeout(() => clearInterval(msgInterval), 15000);
    
    try {
      const response = await fetch('/api/cost-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originCountry: values.originCountry,
          destinationCountry: values.destinationCountry,
          visaType: values.visaType,
          dependents: parseInt(values.dependents),
          travelDate: values.travelDate || undefined,
        }),
      });

      if (!response.ok) {
        // Read response once and store it
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        let errorMessage = "Failed to calculate costs";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If not JSON, use raw text
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const costData = await response.json();

      const calculatorData = {
        originCountry: values.originCountry,
        destinationCountry: values.destinationCountry,
        visaType: values.visaType,
        dependents: values.dependents,
        costData: costData,
        timestamp: new Date().toISOString(),
      };

      sessionStorage.setItem('costCalculatorResults', JSON.stringify(calculatorData));
      
      toast({
        title: 'Analysis Complete!',
        description: 'Redirecting to your personalized cost breakdown...',
      });

      router.push('/cost-calculator/results');
      
    } catch (error: any) {
      console.error('Calculation error:', error);
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: error.message || 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-500 text-white px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            AI-POWERED ANALYSIS
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            True Visa Cost Calculator
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get a complete breakdown of every cost—including the{' '}
            <span className="text-red-400 font-bold">hidden fees</span> most people miss.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">50+ Countries Supported</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Avg Hidden Cost: $4,850</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-full">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm">POF Seasoning Tracker</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-orange-500/30 bg-slate-800/50 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-b border-orange-500/20">
            <CardTitle className="text-2xl md:text-3xl text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-orange-400" />
              Calculate Your True Cost
            </CardTitle>
            <CardDescription className="text-slate-300 text-base">
              Tell us about your journey and our AI will generate a complete cost analysis
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="originCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        Where are you traveling from?
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 text-lg bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select your origin country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-80">
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-white flex items-center gap-2">
                        <Plane className="w-5 h-5 text-green-400" />
                        Where do you want to go?
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 text-lg bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select destination country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-80">
                          {COUNTRIES.filter(c => c.value !== 'Other').map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        What type of visa?
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 text-lg bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select visa type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VISA_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dependents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-pink-400" />
                        Traveling with family?
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 text-lg bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Just me</SelectItem>
                          <SelectItem value="1">Me + 1 dependent</SelectItem>
                          <SelectItem value="2">Me + 2 dependents</SelectItem>
                          <SelectItem value="3">Me + 3 dependents</SelectItem>
                          <SelectItem value="4">Me + 4+ dependents</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="travelDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-yellow-400" />
                        Planned travel date (optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="h-14 text-lg bg-slate-700 border-slate-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                      <p className="text-sm text-slate-400 mt-1">
                        Helps us calculate exact POF seasoning deadlines
                      </p>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      {loadingMessage || 'Analyzing Your Costs...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-3 h-6 w-6" />
                      Get My AI Cost Analysis
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-400">
                  Free analysis • Takes 10 seconds • No signup required for preview
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-white mb-1">Bank-Level Security</h3>
            <p className="text-sm text-slate-400">Your data is encrypted and never shared</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold text-white mb-1">Gemini AI Powered</h3>
            <p className="text-sm text-slate-400">Real-time cost data from official sources</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="font-semibold text-white mb-1">Email Report</h3>
            <p className="text-sm text-slate-400">Full breakdown sent to your inbox</p>
          </div>
        </div>
      </div>
    </div>
  );
}
