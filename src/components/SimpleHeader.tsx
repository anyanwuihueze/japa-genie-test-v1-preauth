'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function SimpleHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl">
          Japa Genie
        </Link>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2"
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                <Link href="/where-youre-stuck" className="py-2" onClick={() => setIsOpen(false)}>
                  Where You're Stuck
                </Link>
                <Link href="/how-it-helps" className="py-2" onClick={() => setIsOpen(false)}>
                  How It Helps
                </Link>
                <Link href="/experts" className="py-2" onClick={() => setIsOpen(false)}>
                  Expert Help
                </Link>
                <Link href="/pricing" className="py-2" onClick={() => setIsOpen(false)}>
                  Japa Pricing
                </Link>
                <Link href="/blog" className="py-2" onClick={() => setIsOpen(false)}>
                  Japa News
                </Link>
                <Link href="/about-us" className="py-2" onClick={() => setIsOpen(false)}>
                  About Us
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
