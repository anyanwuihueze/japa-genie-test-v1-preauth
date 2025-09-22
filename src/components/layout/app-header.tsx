'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { JapaGenieLogo } from "@/components/icons";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  // ✅ FINAL NAV LINKS - Human-first, accurate, no false promises
  const navLinks = [
    { href: "/where-youre-stuck", label: "Where You're Stuck" },
    { href: "/how-it-helps", label: "How It Helps" },
    { href: "/your-next-steps", label: "Your Next Steps" },
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
        <div className="mr-4 hidden md:flex">
          <SidebarTrigger />
        </div>
        
        <Link href="/" className="mr-6 flex items-center gap-2">
          <JapaGenieLogo className="w-7 h-7 text-accent" />
          <span className="font-bold text-lg hidden sm:inline-block">Japa Genie</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLinkItems />
        </nav>

        {/* Auth Buttons */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/progress-map">Log In</Link>
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground" 
            asChild
          >
            <Link href="/chat">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden ml-2">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4">
            <nav className="flex flex-col items-start gap-4">
              <NavLinkItems />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
