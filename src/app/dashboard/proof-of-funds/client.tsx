'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ProofOfFundsClient({ user }: { user: any }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pofData, setPofData] = useState({
    required_amount: 0,
    current_amount: 0,
    currency: 'NGN',
    account_seasoning_days: 0,
    target_seasoning_days: 90,
    source_of_funds: [] as string[],
  });

  useEffect(() => {
    fetchPOFData();
  }, []);

  const fetchPOFData = async () => {
    const supabase = createClient();
    
    try {
      const { data } = await supabase
        .from('user_proof_of_funds')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setPofData(data);
      }
    } catch (error) {
      console.error('POF fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('user_proof_of_funds')
        .upsert({
          user_id: user.id,
          ...pofData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your proof of funds data has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateProgress = () => {
    if (pofData.required_amount === 0) return 0;
    return Math.min((pofData.current_amount / pofData.required_amount) * 100, 100);
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <header>
        <h1 className="text-3xl font-bold">Proof of Funds Manager</h1>
        <p className="text-muted-foreground">Track and manage your financial requirements</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Current Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="w-full h-3 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{pofData.currency} {pofData.current_amount.toLocaleString()}</span>
            <span>{Math.round(calculateProgress())}%</span>
            <span>{pofData.currency} {pofData.required_amount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="required">Required Amount</Label>
              <Input
                id="required"
                type="number"
                value={pofData.required_amount}
                onChange={(e) => setPofData({ ...pofData, required_amount: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 8250000"
              />
            </div>
            
            <div>
              <Label htmlFor="current">Current Amount</Label>
              <Input
                id="current"
                type="number"
                value={pofData.current_amount}
                onChange={(e) => setPofData({ ...pofData, current_amount: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 5000000"
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={pofData.currency}
                onChange={(e) => setPofData({ ...pofData, currency: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="EUR">Euro (€)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Seasoning</CardTitle>
            <CardDescription>How long funds have been in your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seasoning">Days in Account</Label>
              <Input
                id="seasoning"
                type="number"
                value={pofData.account_seasoning_days}
                onChange={(e) => setPofData({ ...pofData, account_seasoning_days: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 45"
              />
            </div>

            <div>
              <Label htmlFor="target">Target Days (Usually 90)</Label>
              <Input
                id="target"
                type="number"
                value={pofData.target_seasoning_days}
                onChange={(e) => setPofData({ ...pofData, target_seasoning_days: parseInt(e.target.value) || 90 })}
                placeholder="90"
              />
            </div>

            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Tip:</strong> Most embassies require funds to be in your account for at least 3 months (90 days).
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Cancel</Link>
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
          <Save className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
