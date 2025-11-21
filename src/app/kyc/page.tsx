// src/app/kyc/page.tsx - FIXED VERSION
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

// Generate session ID for anonymous users
const generateSessionId = () => `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch existing KYC data IF user is logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('user_profiles')
            .select('kyc_completed_at')
            .eq('id', user.id)
            .single();
          setUserProfile(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    if (!authLoading && user) {
      fetchUserProfile();
    }
  }, [user, authLoading, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔄 Submitting KYC for user:', user?.id || 'anonymous');
      console.log('📋 Form data:', formData);

      // Generate session ID for anonymous users
      const sessionId = user ? null : generateSessionId();
      
      // ✅ FIXED: Save KYC data to kyc_sessions table for ALL users
      const { data: kycSession, error: kycError } = await supabase
        .from('kyc_sessions')
        .insert({
          user_id: user?.id || null,
          session_id: sessionId,
          country: formData.country,
          destination_country: formData.destination,
          age: parseInt(formData.age),
          visa_type: formData.visaType,
          profession: formData.profession,
          user_type: formData.userType,
          timeline_urgency: formData.timelineUrgency
        })
        .select()
        .single();

      if (kycError) {
        console.error('❌ Error saving KYC session:', kycError);
        throw kycError;
      }

      console.log('✅ KYC session saved:', kycSession);

      // IF USER IS LOGGED IN: Also save to user_profiles
      if (user?.id) {
        const { data: saveResult, error: saveError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            country: formData.country,
            destination_country: formData.destination,
            age: parseInt(formData.age),
            visa_type: formData.visaType,
            profession: formData.profession,
            user_type: formData.userType,
            timeline_urgency: formData.timelineUrgency,
            kyc_completed_at: new Date().toISOString(),
            kyc_last_updated: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (saveError) {
          console.error('❌ Error saving user profile:', saveError);
        } else {
          console.log('✅ User profile saved to database');
        }

        // Update progress when profile is completed
        try {
          const { error: progressError } = await supabase
            .from('user_progress')
            .upsert({
              user_id: user.id,
              profile_completed: true,
              target_country: formData.destination,
              visa_type: formData.visaType,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });
          
          if (progressError) {
            console.log('⚠️ KYC progress update failed:', progressError);
          } else {
            console.log('✅ KYC progress updated - profile completed');
          }
        } catch (error) {
          console.log('⚠️ Progress update failed (non-critical):', error);
        }

        // Check if returning user
        if (userProfile?.kyc_completed_at) {
          console.log('🔀 Returning user → Dashboard');
          router.push('/dashboard');
          return;
        }
      }

      // ✅ FIXED: Store session ID for anonymous users
      if (!user) {
        sessionStorage.setItem('kyc_session_id', sessionId!);
      }

      console.log('🔀 Redirecting to chat with KYC data');
      router.push('/chat');

    } catch (error) {
      console.error('❌ KYC submission error:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof KYCData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // NO AUTH WALL - Show form to everyone
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    'Study Visa', 'Work Visa', 'Tourist Visa', 'Business Visa', 
    'Family Visa', 'Permanent Residency', 'Not Sure'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="text-center pb-4 relative min-h-[200px] flex items-center justify-center bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-blue-100 to-purple-100"></div>
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

              {/* Timeline */}
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

              {/* Profession */}
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

              {/* Submit */}
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