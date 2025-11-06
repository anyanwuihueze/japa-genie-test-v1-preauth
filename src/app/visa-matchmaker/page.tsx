'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

const formSchema = z.object({
  profession: z.string().min(2, 'Profession is required.'),
  experience: z.string().min(1, 'Years of experience is required.'),
  education: z.string().min(2, 'Education level is required.'),
  destination: z.string().optional(),
  budget: z.string().optional(),
});

export default function VisaMatchmakerPage() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profession: '',
      experience: '',
      education: '',
      destination: '',
      budget: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // In a real app, you would call your AI flow here.
    // For now, we'll simulate a response.
    setTimeout(() => {
      setResults({
        recommendations: [
          { country: 'Canada', visa: 'Express Entry (FSW)', match: 92, notes: 'High demand for your profession.' },
          { country: 'Germany', visa: 'Skilled Worker Visa', match: 88, notes: 'Strong job market for your skills.' },
          { country: 'Australia', visa: 'Skilled Independent visa (subclass 189)', match: 81, notes: 'Points-based system favors your experience.' },
        ]
      });
      setIsLoading(false);
    }, 2000);
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent">
          AI Visa Matchmaker
        </h1>
        <p className="text-lg text-muted-foreground">
          Answer a few questions, and our AI will find the best visa pathways for your specific profile and goals.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Tell Us About Yourself</CardTitle>
          <CardDescription>The more details you provide, the more accurate your matches will be.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Profession/Field</FormLabel>
                      <FormControl><Input placeholder="e.g., Software Engineer, Nurse" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Education</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your education" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="High School">High School Diploma</SelectItem>
                          <SelectItem value="Bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="Masters">Master's Degree</SelectItem>
                          <SelectItem value="PhD">PhD or Doctorate</SelectItem>
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
                      <FormLabel>Desired Destination (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., Canada" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Finding Your Path...</> : <><Wand2 className="mr-2 h-4 w-4" />Find My Visa Matches</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles />
              Your Top Visa Recommendations
            </CardTitle>
            <CardDescription>Based on your profile, here are the most promising pathways for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.recommendations.map((rec: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg bg-background">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{rec.country} - {rec.visa}</h3>
                    <p className="text-sm text-muted-foreground">{rec.notes}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xl font-bold text-green-600">{rec.match}%</p>
                     <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
