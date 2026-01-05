// src/app/kyc/page.tsx - FIXED VERSION
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';
import NameModal from '@/components/modals/NameModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, User, MapPin, Calendar, Briefcase, GraduationCap, Clock, DollarSign, Target } from 'lucide-react';
import { ALL_COUNTRIES } from '@/lib/countries';

interface KYCData {
  country: string;
  destination: string;
  age: string;
  visaType: string;
  profession: string;
  userType: string;
  timelineUrgency: string;
  budget?: string;
}

const generateSessionId = () => `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function KYCPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  
  const [formData, setFormData] = useState<KYCData>({
    country: '', destination: '', age: '', visaType: '', profession: '', userType: '', timelineUrgency: '', budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false); // 🚨 NEW: Lock to prevent race conditions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRedirecting) return; // 🚨 PREVENT double submission
    
    setLoading(true);
    setIsRedirecting(true); // 🚨 LOCK the redirect

    try {
      const sessionId = user ? null : generateSessionId();
      
      // Save to KYC sessions for analytics
      await supabase.from('kyc_sessions').insert({
        user_id: user?.id || null,
        session_id: sessionId,
        country: formData.country,
        destination_country: formData.destination,
        age: parseInt(formData.age),
        visa_type: formData.visaType,
        profession: formData.profession,
        user_type: formData.userType,
        timeline_urgency: formData.timelineUrgency,
        budget: formData.budget || null
      });

      // Save to user profiles if logged in
      if (user?.id) {
        await supabase.from('user_profiles').upsert({
          id: user.id,
          country: formData.country,
          destination_country: formData.destination,
          age: parseInt(formData.age),
          visa_type: formData.visaType,
          profession: formData.profession,
          user_type: formData.userType,
          timeline_urgency: formData.timelineUrgency,
          kyc_completed: true,
          kyc_last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      // 🚨 CRITICAL FIX: Build URL parameters BEFORE any storage
      const params = new URLSearchParams();
      params.append('country', formData.country);
      params.append('destination', formData.destination);
      params.append('age', formData.age);
      params.append('visaType', formData.visaType);
      if (formData.profession) params.append('profession', formData.profession);
      if (formData.userType) params.append('userType', formData.userType);
      if (formData.timelineUrgency) params.append('timelineUrgency', formData.timelineUrgency);
      if (sessionId) params.append('sessionId', sessionId);

      // 🚨 Save to sessionStorage AFTER building params
      sessionStorage.setItem('kycData', JSON.stringify({
        country: formData.country,
        destination: formData.destination,
        age: formData.age,
        visaType: formData.visaType,
        profession: formData.profession,
        userType: formData.userType,
        timelineUrgency: formData.timelineUrgency,
        budget: formData.budget
      }));

      if (!user) sessionStorage.setItem('kyc_session_id', sessionId!);
      
      // 🚨 FORCE REDIRECT WITH PARAMS - No race condition
      console.log('✅ KYC complete, redirecting to chat with params:', params.toString());
      router.push(`/chat?${params.toString()}`);
      
    } catch (error) {
      console.error('KYC submission error:', error);
      alert('Error saving data. Please try again.');
      setIsRedirecting(false); // 🚨 Unlock on error
    } finally {
      setLoading(false);
      // Don't unlock isRedirecting - let the redirect complete
    }
  };

  const updateField = (field: keyof KYCData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // 🚨 BLOCK auth state changes during KYC
  useEffect(() => {
    if (isRedirecting) {
      console.log('🚫 KYC redirect in progress - ignoring auth changes');
    }
  }, [isRedirecting]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const visaTypes = ['Study Visa','Work Visa','Tourist Visa','Business Visa','Family Visa','Permanent Residency','Not Sure'];
  const userTypes = ['Student','Working Professional','Business Owner','Tourist/Visitor','Career Changer','Family Migrant'];
  const timelineOptions = [
    { value: 'asap', label: '🚀 ASAP (0-3 months)' },
    { value: '3-6_months', label: '📅 3-6 months' },
    { value: '6-12_months', label: '🗓️ 6-12 months' },
    { value: 'exploring', label: '🔍 Exploring options' }
  ];
  const budgetOptions = [
    { value: 'under_5k', label: 'Under $5,000' },
    { value: '5k_15k', label: '$5,000 - $15,000' },
    { value: '15k_30k', label: '$15,000 - $30,000' },
    { value: '30k_50k', label: '$30,000 - $50,000' },
    { value: 'over_50k', label: 'Over $50,000' },
    { value: 'not_sure', label: 'Not sure yet' }
  ];

  const steps = [
    {
      title: "Where are you from?",
      icon: MapPin,
      field: 'country' as keyof KYCData,
      placeholder: "Select your country",
      required: true
    },
    {
      title: "Where do you want to go?",
      icon: Target,
      field: 'destination' as keyof KYCData,
      placeholder: "Choose destination",
      required: true
    },
    {
      title: "What's your age?",
      icon: Calendar,
      field: 'age' as keyof KYCData,
      placeholder: "Your age",
      required: true
    },
    {
      title: "What's your profession/field?",
      icon: Briefcase,
      field: 'profession' as keyof KYCData,
      placeholder: "e.g., Software Engineer, Nurse, Teacher",
      required: true
    },
    {
      title: "What's your timeline?",
      icon: Clock,
      field: 'timelineUrgency' as keyof KYCData,
      placeholder: "Select timeline",
      required: true
    },
    {
      title: "What's your budget range? (Optional)",
      icon: DollarSign,
      field: 'budget' as keyof KYCData,
      placeholder: "Select budget range",
      required: false
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      {user && <NameModal user={user} />}
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Global Journey Starts Here
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Answer a few questions for personalized visa advice
            </CardDescription>
            
            {/* Progress indicator */}
            <div className="mt-4">
              <div className="flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Current Question */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  <currentStepData.icon className="w-5 h-5" />
                  {currentStepData.title}
                </Label>
                
                {currentStep === 0 || currentStep === 1 ? (
                  <Select 
                    onValueChange={(v) => updateField(currentStepData.field, v)} 
                    required={currentStepData.required}
                  >
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder={currentStepData.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_COUNTRIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : currentStep === 2 ? (
                  <Input
                    type="number"
                    placeholder={currentStepData.placeholder}
                    className="h-12 text-lg"
                    value={formData[currentStepData.field]}
                    onChange={(e) => updateField(currentStepData.field, e.target.value)}
                    required={currentStepData.required}
                    min="18"
                    max="99"
                  />
                ) : currentStep === 4 ? (
                  <Select 
                    onValueChange={(v) => updateField(currentStepData.field, v)} 
                    required={currentStepData.required}
                  >
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder={currentStepData.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {timelineOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : currentStep === 5 ? (
                  <Select 
                    onValueChange={(v) => updateField(currentStepData.field, v)} 
                    required={currentStepData.required}
                  >
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder={currentStepData.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder={currentStepData.placeholder}
                    className="h-12 text-lg"
                    value={formData[currentStepData.field]}
                    onChange={(e) => updateField(currentStepData.field, e.target.value)}
                    required={currentStepData.required}
                  />
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1"
                    disabled={!formData[currentStepData.field] && currentStepData.required}
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600"
                    disabled={loading || isRedirecting || (currentStepData.required && !formData[currentStepData.field])}
                  >
                    {loading || isRedirecting ? "Processing..." : "Get Personalized Advice"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}