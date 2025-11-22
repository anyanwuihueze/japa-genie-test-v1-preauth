'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import NameModal from '@/components/modals/NameModal';
import { createClient } from '@/lib/supabase/client';
import { ALL_COUNTRIES } from '@/lib/countries';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function KYCProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
import NameModal from '@/components/modals/NameModal';
  const supabase = createClient();
  const [formData, setFormData] = useState({ country: '', destination: '', age: '', visaType: '' });
  const [saving, setSaving] = useState(false);

  // Load existing data
  useEffect(() => {
    if (user) {
      supabase.from('user_profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setFormData({
            country: data.country || '',
            destination: data.destination_country || '',
            age: data.age?.toString() || '',
            visaType: data.visa_type || ''
          });
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('user_profiles').upsert({
      id: user?.id,
      country: formData.country,
      destination_country: formData.destination,
      age: parseInt(formData.age),
      visa_type: formData.visaType,
      kyc_completed_at: new Date().toISOString()
    });
    setSaving(false);
    router.push('/dashboard');
  };

  if (authLoading || !user) return null;

  const visaTypes = ['Study Visa','Work Visa','Tourist Visa','Business Visa','Family Visa','Permanent Residency','Not Sure'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8">Update Your Profile</h1>

          <div>
            <Label>Where are you from?</Label>
            <Select value={formData.country} onValueChange={(v) => setFormData(prev => ({...prev, country: v}))}>
              <SelectTrigger><SelectValue placeholder="Your country" /></SelectTrigger>
              <SelectContent>
                {ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Where do you want to go?</Label>
            <Select value={formData.destination} onValueChange={(v) => setFormData(prev => ({...prev, destination: v}))}>
              <SelectTrigger><SelectValue placeholder="Destination" /></SelectTrigger>
              <SelectContent>
                {ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Save & Go to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
  {user && <NameModal user={user} />}
