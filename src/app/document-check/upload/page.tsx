'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import DocumentUploadClient from './client';

export default function DocumentCheckUploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to home or show auth prompt
    console.log("🔍 DocumentUpload - Auth state:", { user, loading, hasUser: !!user });
    if (!loading && !user) {
      // You could show a sign-in prompt here instead of redirecting

      // Remember where to return after payment\n      localStorage.setItem('returnAfterPayment', '/document-check/upload');
      // Or redirect to a page that has your auth UI
    console.log("🎯 Redirecting to /pricing?feature=document-check");
      router.push('/pricing?feature=document-check'); // Redirect to chat where auth is available
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Document Analysis Tool
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your visa documents for AI-powered analysis
            </p>
          </div>
          
          {/* Upload Client Component */}
          <DocumentUploadClient user={user} />
        </div>
      </div>
    </div>
  );
}
