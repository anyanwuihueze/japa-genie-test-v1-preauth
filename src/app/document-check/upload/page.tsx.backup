import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DocumentUploadClient from './client';

export default async function DocumentCheckUploadPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // If not logged in, redirect to auth with return URL
  if (!user || error) {
    redirect('/auth?returnTo=/document-check/upload');
  }
  
  // User is authenticated, show the upload tool
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