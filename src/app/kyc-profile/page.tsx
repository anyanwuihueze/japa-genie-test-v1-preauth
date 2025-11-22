'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { ALL_COUNTRIES } from '@/lib/countries';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import NameModal from '@/components/modals/NameModal';

export default function KYCProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [country, setCountry] = useState('');
  const [destination, setDestination] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('user_profiles')
      .select('country, destination_country')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setCountry(data.country || '');
          setDestination(data.destination_country || '');
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!country || !destination) {
      setError('Both fields are required');
      return;
    }
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          id: user?.id,
          country,
          destination_country: destination,
          kyc_completed: true,
          kyc_last_updated: new Date().toISOString()
        },
        { onConflict: 'id' }  // ← THIS LINE FIXES EVERYTHING
      );

    if (error) {
      console.error('Save failed:', error);
      setError('Save failed — please try again');
    } else {
      router.push('/dashboard');
    }
    setSaving(false);
  };

  if (authLoading || !user) return null;

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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Where are you from?</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue placeholder="Your country" /></SelectTrigger>
                <SelectContent>{ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Where do you want to go?</label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger><SelectValue placeholder="Destination" /></SelectTrigger>
                <SelectContent>{ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleSave} className="w-full h-12 text-lg" disabled={saving || !country || !destination}>
              {saving ? "Saving..." : "Save & Enter Dashboard"}
            </Button>
          </div>
        </div>
      </div>
      {user && <NameModal user={user} />}
    </>
  );
}
