'use client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function TestPaymentPage() {
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/test-payment')
      .then(r => r.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(data.error || 'Failed to create test session');
        }
      })
      .catch(() => setError('Network error. Are you logged in?'));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
      <p className="text-gray-600">Redirecting to $1 test checkout...</p>
    </div>
  );
}
