'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { ALL_COUNTRIES } from '@/lib/countries';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, X, Globe } from 'lucide-react';
import NameModal from '@/components/modals/NameModal';

const VISA_TYPES = [
  { value: 'student', label: 'Student Visa', icon: '🎓' },
  { value: 'work', label: 'Work Visa', icon: '💼' },
  { value: 'tourist', label: 'Tourist/Visitor Visa', icon: '✈️' },
  { value: 'business', label: 'Business Visa', icon: '💳' },
  { value: 'family', label: 'Family/Dependent Visa', icon: '👨‍👩‍👧‍👦' },
];

export default function KYCProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [country, setCountry] = useState('');
  const [destination, setDestination] = useState('');
  const [visaType, setVisaType] = useState('');
  const [alternativeCountries, setAlternativeCountries] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setInitialLoad(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
        } else if (data) {
          setCountry(data.country || '');
          setDestination(data.destination_country || '');
          setVisaType(data.visa_type || '');
          setAlternativeCountries(data.alternative_countries || []);
          
          // Debug log to see what we're getting
          console.log('Loaded profile:', data);
          console.log('KYC Completed:', data.kyc_completed);
          console.log('Visa Type:', data.visa_type);
        }
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
      } finally {
        setInitialLoad(false);
      }
    };

    loadProfile();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!country || !destination || !visaType) {
      setError('All fields are required');
      return;
    }
    
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const profileData = {
        id: user.id,
        country,
        destination_country: destination,
        visa_type: visaType,
        alternative_countries: alternativeCountries,
        kyc_completed: true,
        kyc_last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Saving profile data:', profileData);

      const { data, error: saveError } = await supabase
        .from('user_profiles')
        .upsert(profileData, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (saveError) {
        console.error('Save error:', saveError);
        setError(`Save failed: ${saveError.message}`);
        return;
      }

      console.log('Save successful:', data);

      // Set session storage for immediate dashboard access
      sessionStorage.setItem('kycData', JSON.stringify({
        country,
        destination,
        visaType,
        alternativeCountries,
        kycCompleted: true
      }));
      
      // Set a flag to force dashboard refresh
      sessionStorage.setItem('kycJustCompleted', 'true');

      setSuccess(true);

      // Force a hard navigation to dashboard to bust cache
      setTimeout(() => {
        window.location.href = '/dashboard?refresh=' + Date.now();
      }, 1000);

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addAlternativeCountry = (country: string) => {
    if (country && !alternativeCountries.includes(country) && country !== destination) {
      setAlternativeCountries([...alternativeCountries, country]);
    }
  };

  const removeAlternativeCountry = (country: string) => {
    setAlternativeCountries(alternativeCountries.filter(c => c !== country));
  };

  if (authLoading || initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
              <Globe className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2">Complete Your Profile</h1>
          <p className="text-center text-muted-foreground mb-8">
            We need a few details to personalize your visa journey
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Profile updated successfully! Redirecting...</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Where are you from? <span className="text-red-500">*</span>
              </label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {ALL_COUNTRIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Destination Country <span className="text-red-500">*</span>
              </label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Where do you want to go?" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {ALL_COUNTRIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Visa Type <span className="text-red-500">*</span>
              </label>
              <Select value={visaType} onValueChange={setVisaType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select visa type" />
                </SelectTrigger>
                <SelectContent>
                  {VISA_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value} className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {visaType && (
                <p className="mt-2 text-sm text-blue-600">
                  {VISA_TYPES.find(t => t.value === visaType)?.icon} {VISA_TYPES.find(t => t.value === visaType)?.label}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Alternative Countries (Optional)
              </label>
              <div className="space-y-2">
                {alternativeCountries.map((altCountry) => (
                  <div key={altCountry} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-sm">{altCountry}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAlternativeCountry(altCountry)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Select onValueChange={addAlternativeCountry}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Add alternative country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {ALL_COUNTRIES.filter(c => c !== destination && !alternativeCountries.includes(c)).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" 
              disabled={saving || !country || !destination || !visaType || success}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : success ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Saved!
                </span>
              ) : (
                "Save & Continue"
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              This helps us provide personalized visa guidance
            </p>
          </div>
        </div>
      </div>
      {user && <NameModal user={user} />}
    </>
  );
}
