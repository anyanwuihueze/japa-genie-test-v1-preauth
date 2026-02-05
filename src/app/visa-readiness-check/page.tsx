'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ALL_COUNTRIES } from '@/lib/countries';
import type { UserProfile } from '@/lib/visa-readiness-calculator';

const VISA_TYPES = ['Student', 'Work', 'Tourist', 'Business', 'Spouse', 'Permanent'];

export default function VisaReadinessCheck() {
  const router = useRouter();
  const [step, setStep] = useState<'setup' | 'questions'>('setup');
  const [country, setCountry] = useState('');
  const [visaType, setVisaType] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserProfile>>({});

  const questions = [
    {
      id: 'hasValidPassport',
      question: 'Is your passport valid for at least 6 months beyond your intended travel date?',
      type: 'boolean' as const
    },
    {
      id: 'allFormsCompleted',
      question: 'Have you completed all required application forms accurately?',
      type: 'boolean' as const
    },
    {
      id: 'bankBalanceAdequate',
      question: 'Do your bank statements show sufficient funds for your destination?',
      type: 'boolean' as const
    },
    {
      id: 'savingsDurationMonths',
      question: 'How many months of consistent bank statements can you provide?',
      type: 'number' as const,
      options: [
        { value: 0, label: 'Less than 3 months' },
        { value: 3, label: '3-5 months' },
        { value: 6, label: '6-11 months' },
        { value: 12, label: '12+ months' }
      ]
    },
    {
      id: 'hasLanguageCertification',
      question: 'Do you have language certification for your destination country?',
      type: 'boolean' as const
    },
    {
      id: 'hasPreviousVisas',
      question: 'Have you successfully obtained and used international visas before?',
      type: 'boolean' as const
    },
    {
      id: 'neverOverstayed',
      question: 'Have you always complied with visa conditions (never overstayed)?',
      type: 'boolean' as const
    },
    {
      id: 'educationVerified',
      question: 'Are your educational credentials officially verified?',
      type: 'boolean' as const
    },
    {
      id: 'workExperienceMatchesJob',
      question: 'Does your work experience align with your intended visa category?',
      type: 'boolean' as const
    },
    {
      id: 'practicedMockInterview',
      question: 'Have you practiced for visa interview questions?',
      type: 'boolean' as const
    },
    {
      id: 'dependentsInHomeCountry',
      question: 'Do you have family dependents remaining in your home country?',
      type: 'boolean' as const
    },
    {
      id: 'propertyOwnership',
      question: 'Do you own property or have significant assets in your home country?',
      type: 'boolean' as const
    }
  ];

  const handleStartQuestions = () => {
    if (!country || !visaType) return;
    setStep('questions');
  };

  const handleAnswer = (value: boolean | number) => {
    const questionId = questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Store everything and navigate to AI results
      localStorage.setItem('visaReadinessData', JSON.stringify({
        country,
        visaType,
        answers: newAnswers
      }));
      router.push('/visa-readiness-results');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  // SETUP SCREEN
  if (step === 'setup') {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-4">
              <Shield className="w-4 h-4" />
              Free Assessment • No Signup Required
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Visa Readiness Check
            </h1>
            
            <p className="text-lg text-gray-700">
              Get AI-powered analysis of your application weaknesses
            </p>
          </div>

          <Card className="p-8 md:p-12 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2 text-lg text-gray-800">
                  🌍 Where are you applying?
                </label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-full text-lg p-6">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    {ALL_COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-lg text-gray-800">
                  📋 What visa type?
                </label>
                <Select value={visaType} onValueChange={setVisaType}>
                  <SelectTrigger className="w-full text-lg p-6">
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISA_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type} Visa</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleStartQuestions}
                disabled={!country || !visaType}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6"
              >
                Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  // QUESTIONS SCREEN
  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            {country} {visaType} Visa Assessment
          </h1>
          <p className="text-gray-600">Answer honestly for accurate AI analysis</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-3 bg-white/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 md:p-12 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
            {currentQ.question}
          </h2>

          {currentQ.type === 'boolean' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswer(true)}
                size="lg"
                className="h-20 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <CheckCircle className="mr-2 h-6 w-6" />
                Yes
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                size="lg"
                variant="outline"
                className="h-20 text-lg border-2 border-gray-300 hover:bg-gray-50"
              >
                No
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentQ.options?.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  size="lg"
                  variant="outline"
                  className="w-full h-16 text-lg border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-400"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </Card>

        {/* Navigation */}
        {currentQuestion > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              variant="ghost"
              className="text-gray-600"
            >
              ← Previous Question
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
