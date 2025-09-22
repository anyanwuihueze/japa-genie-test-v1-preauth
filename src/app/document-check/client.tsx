'use client';

import { useState } from 'react';
import { documentChecker } from '@/ai/flows/document-checker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, FileCheck2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DocumentCheckClient() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setReport(null);
      setError(null);
    }
  };

  const handleCheckDocument = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const documentDataUri = reader.result as string;
      try {
        const result = await documentChecker({ documentDataUri });
        setReport(result.report);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during analysis.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error Checking Document',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      const errorMessage = 'Failed to read the file.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: errorMessage,
      });
      setIsLoading(false);
    };
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Select a document file (e.g., PDF, DOCX, PNG, JPG) to be analyzed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document">Document</Label>
            <div className="flex gap-4">
              <Input id="document" type="file" onChange={handleFileChange} />
              <Button onClick={handleCheckDocument} disabled={!file || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileCheck2 className="mr-2 h-4 w-4" />
                    Check Document
                  </>
                )}
              </Button>
            </div>
          </div>
          {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
            <CardDescription>The AI has reviewed your document. Here are the findings:</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg whitespace-pre-wrap font-sans text-sm">{report}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
