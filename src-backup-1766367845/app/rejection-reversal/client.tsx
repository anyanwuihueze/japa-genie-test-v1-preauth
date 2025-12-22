'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Sparkles, Wand2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateRejectionStrategy, type RejectionStrategyInput, type RejectionStrategyOutput } from '@/ai/flows/rejection-reversal';
import { RejectionStrategyInputSchema } from '@/ai/schemas/rejection-reversal-schema';

type FormValues = RejectionStrategyInput;

export default function RejectionReversalClient() {
  const { toast } = useToast();
  const [strategy, setStrategy] = useState<RejectionStrategyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(RejectionStrategyInputSchema),
    defaultValues: {
      visaType: '',
      destination: '',
      rejectionReason: '',
      userBackground: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setStrategy(null);

    try {
      const result = await generateRejectionStrategy(data);
      setStrategy(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error Generating Strategy',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tell Us What Happened</CardTitle>
          <CardDescription>
            Provide details about your visa rejection, and our AI will create a personalized comeback strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the visa you applied for" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Student Visa">Student Visa</SelectItem>
                          <SelectItem value="Work Visa / Permit">Work Visa / Permit</SelectItem>
                          <SelectItem value="Tourist / Visitor Visa">Tourist / Visitor Visa</SelectItem>
                          <SelectItem value="Business Visa">Business Visa</SelectItem>
                          <SelectItem value="Family / Spousal Visa">Family / Spousal Visa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Canada, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Official Rejection Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Copy and paste the reason from your rejection letter, if you have it." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userBackground"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Background & Purpose of Travel</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe your situation. For example: 'I am a 28-year-old marketing manager applying for a skilled worker visa to Germany. I have a job offer...'" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Your Case...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate My Comeback Strategy
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {strategy && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles />
              Your Personalized Rejection Reversal Plan
            </CardTitle>
            <CardDescription>{strategy.introduction}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {strategy.strategy.map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0 mt-1">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{step.headline}</h3>
                  <p className="text-muted-foreground">{step.details}</p>
                </div>
              </div>
            ))}
             <div className="mt-6 border-t border-primary/20 pt-6">
                <p className="text-center font-medium text-muted-foreground">{strategy.conclusion}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}