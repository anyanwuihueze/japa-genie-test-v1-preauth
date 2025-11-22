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
import { ALL_COUNTRIES } from '@/lib/countries';

interface KYCData {
  country: string;
  destination: string;
  age: string;
  visaType: string;
  profession: string;
  userType: string;
  timelineUrgency: string;
}

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

  useEffect(() => {
    if (!authLoading && user) {
      const fetchUserProfile = async () => {
        const { data } = await supabase
          .from('user_profiles')
          .select('kyc_completed_at')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      };
      fetchUserProfile();
    }
  }, [user, authLoading, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionId = user ? null : generateSessionId();
      
      const { error: kycError } = await supabase
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
        });

      if (kycError) throw kycError;

      if (user?.id) {
        await supabase
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
          });
      }

      if (!user) {
        sessionStorage.setItem('kyc_session_id', sessionId!);
      }

      router.push('/chat');
    } catch (error) {
      alert('Error saving data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof KYCData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const visaTypes = ['Study Visa', 'Work Visa', 'Tourist Visa', 'Business Visa', 'Family Visa', 'Permanent Residency', 'Not Sure'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Global Journey Starts Here
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Answer a few questions for personalized visa advice
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  Where are you from?
                </Label>
                <Select onValueChange={(v) => updateField('country', v)} required>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_COUNTRIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  Where do you want to go?
                </Label>
                <Select onValueChange={(v) => updateField('destination', v)} required>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Choose destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_COUNTRIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rest of your form fields — unchanged */}
              <div className="space-y-3">
                <Label>How old are you?</Label>
                <Input type="number" placeholder="Enter your age" value={formData.age} onChange={(e) => updateField('age', e.target.value)} required min="18" max="65" />
              </div>

              <div className="space-y-3">
                <Label>What type of visa are you interested in?</Label>
                <Select onValueChange={(v) => updateField('visaType', v)} required>
                  <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                  <SelectContent>
                    {visaTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Add other fields as needed... */}

              <Button type="submit" className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600" disabled={loading}>
                {loading ? "Saving..." : "Get Personalized Advice →"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
