'use client';
import DocumentUploadClient from './client'; // Correctly imports the client component
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileWarning, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function DocumentCheckPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (!user) {
    // Redirect to login but remember to come back here
    router.push('/pricing?reason=tool_access&returnTo=/document-check');
    return null;
  }
  
  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent">
          Rejection-Proof Your Documents
        </h1>
        <p className="text-lg text-muted-foreground">
          80% of visa rejections stem from document errors. Use our AI to scan, verify, and fortify your application against common red flags before you submit.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        <Card>
          <CardHeader>
            <div className="p-3 bg-primary/10 rounded-full text-primary w-fit mx-auto mb-2">
              <FileWarning className="w-7 h-7" />
            </div>
            <CardTitle>Error Detection</CardTitle>
            <CardDescription>Our AI finds missing signatures, incorrect dates, and conflicting information that agents miss.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="p-3 bg-primary/10 rounded-full text-primary w-fit mx-auto mb-2">
              <Shield className="w-7 h-7" />
            </div>
            <CardTitle>Fraud Prevention</CardTitle>
            <CardDescription>We help you source verifiable documents to ensure your application withstands embassy scrutiny.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="p-3 bg-primary/10 rounded-full text-primary w-fit mx-auto mb-2">
              <CheckCircle className="w-7 h-7" />
            </div>
            <CardTitle>Format Compliance</CardTitle>
            <CardDescription>Ensure every document meets the specific formatting requirements of your target country.</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      {/* This now renders the correct, functional client component */}
      <DocumentUploadClient user={user} />
    </div>
  );
}
