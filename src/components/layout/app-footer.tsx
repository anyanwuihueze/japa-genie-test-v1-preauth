'use client';

import Link from 'next/link';
import { JapaGenieLogo } from '@/components/icons'; 

export function AppFooter() {
  return (
    <footer className="bg-card border-t border-border/50 py-4 px-4 text-center text-xs text-muted-foreground">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center group">
            <JapaGenieLogo className="w-5 h-5 text-accent group-hover:scale-105 transition-transform" />
            <span className="font-semibold text-primary/90">Japa Genie</span>
          </Link>
        </div>
        <p className="text-xs">&copy; {new Date().getFullYear()} All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
          <Link href="/terms-of-service" className="hover:underline">Terms</Link>
          <Link href="/contact-us" className="hover:underline">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
