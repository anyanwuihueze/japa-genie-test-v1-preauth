// src/app/kyc/page.tsx - COMPLETE FIXED VERSION
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { ALL_COUNTRIES } from '@/lib/countries';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import NameModal from '@/components/modals/NameModal';

export default function KYCProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [country, setCountry] = useState('');
  const [destination, setDestination] = useState('');
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
        console.log('Loading profile for user:', user.id);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('country, destination_country')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
        } else if (data) {
          console.log('Loaded profile data:', data);
          setCountry(data.country || '');
          setDestination(data.destination_country || '');
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
    console.log('🚨 handleSave CALLED');
    
    if (!country || !destination) {
      console.log('❌ Validation failed');
      setError('Both fields are required');
      return;
    }
    
    if (!user) {
      console.log('❌ No user found');
      setError('User not authenticated');
      return;
    }

    console.log('✅ Starting save for user:', user.id);
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Use upsert instead of insert/update logic
      const { data, error: saveError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          country,
          destination_country: destination,
          kyc_completed: true,
          kyc_last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (saveError) {
        console.log('❌ SAVE FAILED:', saveError);
        setError(`Save failed: ${saveError.message}`);
        return;
      }

      console.log('🎉 SUCCESS! Profile saved:', data);
      
      // 🚀 SAVE KYC DATA TO SESSION STORAGE FOR CHAT
      sessionStorage.setItem('kycData', JSON.stringify({
        country,
        destination,
        age: data?.age || '',
        visaType: data?.visa_type || '',
        profession: data?.profession || ''
      }));

      setSuccess(true);

      // 🚀 SIMPLE REDIRECT - NO BULLSHIT
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

    } catch (err) {
      console.log('💥 UNEXPECTED ERROR:', err);
      setError('Unexpected error occurred');
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-3xl font-bold text-center mb-2">Quick Update</h1>
          <p className="text-center text-muted-foreground mb-8">
            We just need your origin and destination to keep your journey accurate
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              Profile updated successfully! Redirecting...
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Where are you from?</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Your country" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_COUNTRIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Where do you want to go?</label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_COUNTRIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleSave} 
              className="w-full h-12 text-lg" 
              disabled={saving || !country || !destination || success}
            >
              {saving ? "Saving..." : success ? "Saved! Redirecting..." : "Save & Enter Dashboard"}
            </Button>
          </div>
        </div>
      </div>
      {user && <NameModal user={user} />}
    </>
  );
}