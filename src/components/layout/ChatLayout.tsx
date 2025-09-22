import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, BarChart3, FileText, HelpCircle } from "lucide-react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>

            {/* Center - Title */}
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Japa Genie Chat Assistant
              </h1>
            </div>

            {/* Right side - Quick nav */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/progress-map" 
                className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors"
                title="Progress Map"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Progress Map
              </Link>
              <Link 
                href="/features" 
                className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors"
                title="Features"
              >
                <FileText className="w-4 h-4 mr-1" />
                Features
              </Link>
              <Link 
                href="/how-it-works" 
                className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition-colors"
                title="How it Works"
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Help
              </Link>
              <Link 
                href="/" 
                className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors font-medium"
                title="Home"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
