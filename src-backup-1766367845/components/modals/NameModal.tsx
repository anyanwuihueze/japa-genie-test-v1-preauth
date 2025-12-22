'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function NameModal({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!user) return;

    const check = async () => {
      const { data } = await createClient()
        .from('user_profiles')
        .select('preferred_name')
        .eq('id', user.id)
        .single();

      if (!data?.preferred_name) {
        setOpen(true);
      }
    };

    check();
  }, [user]);

  const save = async () => {
    if (!name.trim()) return;

    await createClient()
      .from('user_profiles')
      .update({ preferred_name: name.trim() })
      .eq('id', user.id);

    setOpen(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Hey there!</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-muted-foreground">
            What should I call you? Your first name works best
          </p>
          <Input
            placeholder="e.g. Prince, Chioma, Tunde"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <Button onClick={save} className="w-full" size="lg">
            Continue as {name || 'you'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
