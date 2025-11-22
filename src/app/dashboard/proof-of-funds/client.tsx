'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { ALL_COUNTRIES } from '@/lib/countries';
import { Download } from 'lucide-react';

interface ProofOfFundsClientProps {
  user: any;
  userProfile: any;
  needsKYC?: boolean;
}

export default function ProofOfFundsClient({ user, userProfile, needsKYC = false }: ProofOfFundsClientProps) {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [manualData, setManualData] = useState({
    destination_country: userProfile?.destination_country || '',
    visa_type: userProfile?.visa_type || '',
  });

  const generatePDFReport = async () => {
    if (!analysisResult) return;
    // your existing PDF logic
  };

  return (
    <div className="space-y-6">
      <Dialog open={showDataModal} onOpenChange={setShowDataModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Quick Information Needed</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Destination Country</Label>
              <Select value={manualData.destination_country} onValueChange={(v) => setManualData(prev => ({...prev, destination_country: v}))}>
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>
                  {ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Visa Type</Label>
              <Select value={manualData.visa_type} onValueChange={(v) => setManualData(prev => ({...prev, visa_type: v}))}>
                <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                  {['Study Visa',' Work Visa','Tourist Visa','Business Visa','Family Visa','Permanent Residency'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowDataModal(false)} className="w-full">Continue</Button>
          </div>
        </DialogContent>
      </Dialog>

      {analysisResult && (
        <Button onClick={generatePDFReport} size="lg">
          <Download className="mr-2 h-4 w-4" /> Download PDF Report
        </Button>
      )}
    </div>
  );
}
