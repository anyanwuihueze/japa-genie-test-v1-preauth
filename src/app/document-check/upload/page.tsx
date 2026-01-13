'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import DocumentUploadClient from './client';

export default function DocumentCheckUploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?returnTo=/document-check/upload');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">AI Document Checker</h1>
        <p className="text-lg text-muted-foreground">
          Upload your documents for instant analysis. Our AI will check for common errors and compliance issues.
        </p>
      </header>
      <DocumentUploadClient user={user} />
    </div>
  );
}