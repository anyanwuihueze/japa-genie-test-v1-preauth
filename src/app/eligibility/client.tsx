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
import { Loader2, CheckCircle2, AlertCircle, Sparkles, MapPin, TrendingUp, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  destination: z.string().min(2, 'Destination country is required.'),
  visaType: z.string().min(2, 'Visa type is required.'),
  background: z.string().min(20, 'Please provide more details about your background.'),
  currentSituation: z.string().min(10, 'Please briefly describe your current situation.'),
});

export default function EligibilityCheckClient() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      visaType: 'Work Visa',
      background: '',
      currentSituation: '',
    },
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
      
      // In production, you'd redirect to results page with the data
      // router.push('/eligibility-results');
      
      // For now, just show success
      toast({
        title: 'Success!',
        description: 'Your eligibility assessment is ready. Check your dashboard for details.',
      });
      
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
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Check Your Eligibility First
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Most visa applications fail because people apply blindly. Don't be one of them.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full w-fit">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Find Your Best Match</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Discover which countries you realistically qualify for based on your profile.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-50 rounded-full w-fit">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-lg">Get Honest Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Receive transparent feedback on your chances — even if the answer is "not yet."
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-purple-50 rounded-full w-fit">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Know What to Improve</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Learn exactly what you need to strengthen before applying.
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

              <Button 
                type="submit" 
                disabled={isLoading}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-primary hover:shadow-lg transition-all text-lg py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Your Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Check My Eligibility Now
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Not sure where to start? This is your safest first step before spending money on applications.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Trust Element */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-muted-foreground">
          Join <span className="font-bold text-primary">2,000+ users</span> who checked their eligibility before applying
        </p>
      </div>
    </div>
  );
}