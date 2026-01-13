'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Link from 'next/link';

export function DocumentUpload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Documents
        </CardTitle>
        <CardDescription>
          Upload and verify your documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
          <Link href="/document-check">
            Check Documents
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}