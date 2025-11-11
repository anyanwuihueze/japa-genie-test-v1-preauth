// src/app/kyc/page.tsx - ENHANCED WITH DATABASE SAVE
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, User, MapPin, Calendar, Briefcase, GraduationCap, Clock } from 'lucide-react';

interface KYCData {
  country: string;
  destination: string;
  age: string;
  visaType: string;
  profession: string;
  userType: string;
  timelineUrgency: string;
}

export default function KYCPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [formData, setFormData] = useState<KYCData>({
    country: '',
    destination: '',
    age: '',
    visaType: '',
    profession: '',
    userType: '',
    timelineUrgency: ''
  });
  const [loading, setLoading] = useState(false);

  // 🔥 Redirect signed-in users to chat immediately
  useEffect(() => {
    if (!authLoading && user) {
      console.log('✅ User is signed in, redirecting to chat...');
      router.push('/chat');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ KEEP EXISTING BEHAVIOR (for chat page)
      sessionStorage.setItem('kycData', JSON.stringify(formData));
      
      // ✅ NEW: Save to database for returning users and dashboard
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user?.id,
          country: formData.country,
          destination_country: formData.destination,
          age: parseInt(formData.age),
          visa_type: formData.visaType,
          profession: formData.profession,
          user_type: formData.userType,
          timeline_urgency: formData.timelineUrgency,
          kyc_completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving KYC data:', error);
        // Continue anyway - sessionStorage will work for chat
      } else {
        console.log('✅ KYC data saved to database');
      }

      // ✅ KEEP EXISTING REDIRECT BEHAVIOR
      const params = new URLSearchParams({
        country: formData.country,
        destination: formData.destination,
        age: formData.age,
        visaType: formData.visaType,
        ...(formData.profession && { profession: formData.profession })
      });

      router.push(`/chat?${params.toString()}`);

    } catch (error) {
      console.error('KYC submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof KYCData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🔥 If user is signed in, show redirect message
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting to chat...</p>
        </div>
      </div>
    );
  }

  const popularDestinations = [
    'Canada', 'USA', 'UK', 'Germany', 'Australia', 'France', 'Netherlands', 
    'Sweden', 'Norway', 'Ireland', 'New Zealand', 'Japan', 'Singapore', 'UAE'
  ];

  const africanCountries = [
    'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Ethiopia', 'Tanzania',
    'Uganda', 'Rwanda', 'Cameroon', 'Senegal', 'Ivory Coast', 'Zambia', 'Zimbabwe'
  ];

  const visaTypes = [
    'Study Visa',
    'Work Visa', 
    'Tourist Visa',
    'Business Visa',
    'Family Visa',
    'Permanent Residency',
    'Not Sure'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="text-center pb-4 relative min-h-[200px] flex items-center justify-center bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="absolute inset-0 bg-[url('/passport-stamps-collage.jpg')] bg-cover bg-center opacity-40"></div>
            <div className="relative z-10">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Global Journey Starts Here
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Answer a few questions for personalized visa advice
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Country of Origin */}
              <div className="space-y-3">
                <Label htmlFor="country" className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Where are you from?
                </Label>
                <Select onValueChange={(value) => updateField('country', value)} required>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {africanCountries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination */}
              <div className="space-y-3">
                <Label htmlFor="destination" className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Where do you want to go?
                </Label>
                <Select onValueChange={(value) => updateField('destination', value)} required>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Choose destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularDestinations.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <Label htmlFor="age" className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  How old are you?
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  className="h-12 text-lg"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  required
                  min="18"
                  max="65"
                />
              </div>

              {/* Visa Type */}
              <div className="space-y-3">
                <Label htmlFor="visaType" className="flex items-center gap-2 text-lg font-semibold">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  What type of visa are you interested in?
                </Label>
                <Select onValueChange={(value) => updateField('visaType', value)} required>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    {visaTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Type */}
              <div className="space-y-3">
                <Label htmlFor="userType" className="flex items-center gap-2 text-lg font-semibold">
                  <User className="w-5 h-5 text-blue-600" />
                  What best describes you?
                </Label>
                <Select onValueChange={(value) => updateField('userType', value)} required>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select your situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">🎓 Student</SelectItem>
                    <SelectItem value="professional">💼 Working Professional</SelectItem>
                    <SelectItem value="business_owner">🏢 Business Owner</SelectItem>
                    <SelectItem value="tourist">✈️ Tourist/Visitor</SelectItem>
                    <SelectItem value="career_changer">🔄 Career Changer</SelectItem>
                    <SelectItem value="family_migrant">🏠 Family Migrant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timeline Urgency */}
              <div className="space-y-3">
                <Label htmlFor="timelineUrgency" className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="w-5 h-5 text-green-600" />
                  When do you plan to move?
                </Label>
                <Select onValueChange={(value) => updateField('timelineUrgency', value)} required>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">🚀 ASAP (0-3 months)</SelectItem>
                    <SelectItem value="3-6_months">📅 3-6 months</SelectItem>
                    <SelectItem value="6-12_months">🗓️ 6-12 months</SelectItem>
                    <SelectItem value="exploring">🔍 Just exploring options</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Profession (Optional) */}
              <div className="space-y-3">
                <Label htmlFor="profession" className="flex items-center gap-2 text-lg font-semibold">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  What's your profession? (Optional)
                </Label>
                <Input
                  id="profession"
                  placeholder="e.g., Software Engineer, Nurse, Student"
                  className="h-12 text-lg"
                  value={formData.profession}
                  onChange={(e) => updateField('profession', e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading || !formData.country || !formData.destination || !formData.age || !formData.visaType || !formData.userType || !formData.timelineUrgency}
              >
                {loading ? (
                  <>Analyzing Your Profile...</>
                ) : (
                  <>
                    Get Personalized Advice
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Your information helps me provide accurate, personalized visa guidance
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}