'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { JapaGenieLogo } from "@/components/icons";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/lib/AuthContext';

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, signInWithGoogle, signOut } = useAuth();
  
  // Check if user needs to log in for checkout
  const authRequired = searchParams?.get('auth') === 'required';
  const planData = searchParams?.get('plan');

  // Show prompt if auth is required
  useEffect(() => {
    if (authRequired && !user) {
      // Auto-trigger login with redirect to checkout
      const checkoutPath = planData ? `/checkout?plan=${planData}` : '/checkout';
      signInWithGoogle(checkoutPath);
    }
  }, [authRequired, user, planData]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/your-next-steps', label: 'Get Started' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 glass-effect">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-2">
          {pathname === '/chat' && <SidebarTrigger />}
          <Link href="/" className="flex items-center gap-2">
            <JapaGenieLogo className="h-8 w-8" />
            <span className="text-xl font-bold hidden sm:inline-block">JapaGenie</span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          {user ? (
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => signInWithGoogle()}
            >
              Log In
            </Button>
          )}
          
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground" 
            asChild
          >
            <Link href="/chat">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <button
          className="md:hidden ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
