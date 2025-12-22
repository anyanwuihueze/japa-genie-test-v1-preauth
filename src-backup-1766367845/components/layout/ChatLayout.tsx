'use client';

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, BarChart3, FileText, HelpCircle, Menu, X } from "lucide-react";
import HelpButtonWrapper from './help-button-wrapper';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side - Back button */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </div>

            {/* Center - Title */}
            <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">
                Japa Genie Chat
              </h1>
            </div>

            {/* Right side - Desktop nav & Mobile menu button */}
            <div className="flex items-center">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  href="/progress-map" 
                  className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors"
                  title="Progress Map"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Progress
                </Link>
                <Link 
                  href="/features" 
                  className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors"
                  title="Features"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Features
                </Link>
                <HelpButtonWrapper href="/how-it-works">
                  <div className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Help
                  </div>
                </HelpButtonWrapper>
                <Link 
                  href="/" 
                  className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors font-medium"
                  title="Home"
                >
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/progress-map" 
                  className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Progress Map
                </Link>
                <Link 
                  href="/features" 
                  className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Features
                </Link>
                <HelpButtonWrapper href="/how-it-works">
                  <div 
                    className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Help
                  </div>
                </HelpButtonWrapper>
                <Link 
                  href="/" 
                  className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors font-medium text-sm mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Content */}
      <div className="max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
