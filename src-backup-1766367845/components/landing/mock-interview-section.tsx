'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const interviewQuestions = [
  'Can you explain your study plans in detail?',
  'How will you finance your education?',
  'What are your plans after graduation?',
  'Do you have any relatives in the country?',
  'Why did you choose this specific university?',
];

export function MockInterviewSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Mock Interview Preparation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice with our AI-powered interview generator and increase your chances of approval.
          </p>
        </header>

        <Tabs defaultValue="student" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="student" className="mt-10">
            <Card className="bg-primary/5 max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Sample Interview Questions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <ul className="space-y-4 mb-8">
                  {interviewQuestions.map((question, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                   <Button asChild size="lg" className="w-full bg-gradient-to-r from-amber-400 to-primary text-primary-foreground hover:shadow-lg transition-shadow">
                      <Link href="/interview">
                          Start Practice Interview <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="work"><p className="text-center text-muted-foreground p-10">Work Permits content coming soon.</p></TabsContent>
          <TabsContent value="business"><p className="text-center text-muted-foreground p-10">Business Visas content coming soon.</p></TabsContent>
          <TabsContent value="family"><p className="text-center text-muted-foreground p-10">Family Reunification content coming soon.</p></TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
