'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateInterviewQuestion } from '@/ai/flows/interview-flow';
import type { InterviewQuestionInput } from '@/ai/flows/interview-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Sparkles, MessageSquareQuote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  visaType: z.string().min(2, 'Visa type is required.'),
  destination: z.string().min(2, 'Destination country is required.'),
  userBackground: z.string().min(20, 'Please provide a brief background.'),
});

interface InterviewTurn {
  question: string;
  answer: string;
}

export default function InterviewClient() {
  const { toast } = useToast();
  const [interviewHistory, setInterviewHistory] = useState<InterviewTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visaType: 'Student Visa',
      destination: '',
      userBackground: '',
    },
  });

  async function handleStartInterview(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setCurrentQuestion(null);
    setInterviewHistory([]);
    setIsInterviewStarted(true);

    try {
      const result = await generateInterviewQuestion({
        ...values,
        previousQuestions: [],
      });
      setCurrentQuestion(result.question);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error Starting Interview',
        description: errorMessage,
      });
      setIsInterviewStarted(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNextQuestion() {
    if (!currentQuestion) return;

    setIsLoading(true);
    setError(null);
    const newTurn: InterviewTurn = { question: currentQuestion, answer: currentAnswer };
    const updatedHistory = [...interviewHistory, newTurn];
    setInterviewHistory(updatedHistory);
    setCurrentQuestion(null);
    setCurrentAnswer('');
    
    try {
        const previousQuestions = updatedHistory.map(turn => turn.question);
        const result = await generateInterviewQuestion({
            ...form.getValues(),
            previousQuestions
        });
        setCurrentQuestion(result.question);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
            variant: 'destructive',
            title: 'Error Getting Next Question',
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  }

  const renderSetup = () => (
    <Card>
      <CardHeader>
        <CardTitle>Prepare for your Interview</CardTitle>
        <CardDescription>Fill out your details to begin a mock interview session with our AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleStartInterview)} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a visa type" />
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
                        <Input placeholder="e.g., USA, Germany" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
             <FormField
                control={form.control}
                name="userBackground"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Brief Background</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I am a software engineer with 5 years of experience, applying for a skilled worker visa...' or 'I have been accepted to study a Masters in Computer Science at...'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Interview
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderInterview = () => (
     <div className="space-y-8">
        {error && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <Card className="bg-primary/5">
            <CardHeader className="flex flex-row items-start gap-4">
                <div className="bg-primary text-primary-foreground rounded-full p-3 flex-shrink-0">
                    <MessageSquareQuote className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>AI Interviewer Question</CardTitle>
                    <CardDescription>Read the question below and type your answer.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && !currentQuestion ? (
                     <div className="flex items-center gap-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating next question...</p>
                    </div>
                ): (
                    <p className="text-lg font-semibold text-foreground">{currentQuestion}</p>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Compose your answer here..."
                    className="min-h-[150px]"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    disabled={isLoading || !currentQuestion}
                />
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsInterviewStarted(false)}>End Interview</Button>
                <Button onClick={handleNextQuestion} disabled={isLoading || !currentAnswer.trim()}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ): 'Submit & Next Question'}
                </Button>
            </CardFooter>
        </Card>
        
        {interviewHistory.length > 0 && (
            <div className="space-y-6">
                 <h2 className="text-2xl font-bold">Interview History</h2>
                 {interviewHistory.slice().reverse().map((turn, index) => (
                    <Card key={index} className="border-l-4 border-primary/40">
                        <CardHeader>
                           <p className="text-sm font-medium text-primary">Q: {turn.question}</p>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground">A: {turn.answer}</p>
                        </CardContent>
                    </Card>
                 ))}
            </div>
        )}
     </div>
  );

  return isInterviewStarted ? renderInterview() : renderSetup();
}
