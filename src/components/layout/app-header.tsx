'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const { user, signInWithGoogle, signOut } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/where-youre-stuck", label: "Where You're Stuck" },
    { href: "/how-it-helps", label: "How It Helps" },
    { href: "/experts", label: "Expert Help" }, // ← ADDED THIS LINE
    { href: "/your-next-steps", label: "Japa Pricing" },
    { href: "/blog", label: "Japa news" },
    { href: "/about-us", label: "About Us" },
  ];
  
  const NavLinkItems = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => isMobileMenuOpen && toggleMobileMenu()}
          className={cn(
            "text-sm font-medium text-muted-foreground hover:text-primary transition-colors",
            pathname === link.href && "text-primary"
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 glass-effect">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-2">
          {pathname === '/chat' && <SidebarTrigger />}
          <Link href="/" className="flex items-center gap-2">
            <JapaGenieLogo className="h-8 w-8" />
            <span className="text-xl font-bold hidden sm:inline-block">Japa Genie</span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          <NavLinkItems />
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          {user ? (
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => signInWithGoogle()}>
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
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 flex flex-col gap-4">
            <NavLinkItems />
          </nav>
        </div>
      )}
    </header>
  );
}