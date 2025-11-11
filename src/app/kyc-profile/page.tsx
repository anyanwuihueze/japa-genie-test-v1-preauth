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
import { ArrowLeft, User, MapPin, Calendar, Briefcase, GraduationCap, Clock, Save } from 'lucide-react';

interface KYCData {
  country: string;
  destination: string;
  age: string;
  visaType: string;
  profession: string;
  userType: string;
  timelineUrgency: string;
}

export default function KYCProfilePage() {
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
  const [saving, setSaving] = useState(false);

  // Load existing profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData({
            country: profile.country || '',
            destination: profile.destination_country || '',
            age: profile.age?.toString() || '',
            visaType: profile.visa_type || '',
            profession: profile.profession || '',
            userType: profile.user_type || '',
            timelineUrgency: profile.timeline_urgency || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    if (!authLoading && user) {
      loadProfileData();
    }
  }, [user, authLoading, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save to database
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
          kyc_completed_at: new Date().toISOString(),
          kyc_last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving profile data:', error);
        alert('Error saving profile. Please try again.');
      } else {
        console.log('✅ Profile updated successfully');
        // Redirect back to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
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

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login');
    return null;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Update Your Profile</h1>
            <p className="text-muted-foreground">Keep your immigration journey details current</p>
          </div>
        </div>

        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="text-center pb-4 relative min-h-[120px] flex items-center justify-center bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="absolute inset-0 bg-[url('/passport-stamps-collage.jpg')] bg-cover bg-center opacity-30"></div>
            <div className="relative z-10">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Journey, Your Way
              </CardTitle>
              <CardDescription className="text-base">
                Update your profile for personalized guidance
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
                <Select onValueChange={(value) => updateField('country', value)} value={formData.country}>
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
                <Select onValueChange={(value) => updateField('destination', value)} value={formData.destination}>
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
                <Select onValueChange={(value) => updateField('visaType', value)} value={formData.visaType}>
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
                <Select onValueChange={(value) => updateField('userType', value)} value={formData.userType}>
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
                <Select onValueChange={(value) => updateField('timelineUrgency', value)} value={formData.timelineUrgency}>
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

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1 h-12"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={saving}
                >
                  {saving ? (
                    <>Saving Changes...</>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Your updated information helps us provide the most accurate visa guidance
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
