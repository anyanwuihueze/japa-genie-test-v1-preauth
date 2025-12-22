import { Button } from '@/components/ui/button';
import Link from 'next/link';

function BenefitCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: string, title: string, description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function AsylumPage() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Asylum & Refugee Protection Guidance
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compassionate support for those seeking safety and protection. Your journey matters.
          </p>
        </div>

        {/* Understanding Asylum Section */}
        <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Understanding Your Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BenefitCard 
              title="Asylum Seeker Support"
              description="Guidance through the complex asylum application process with dignity and respect for your situation."
              icon="🕊️"
            />
            <BenefitCard 
              title="Refugee Protection"
              description="Information about refugee status determination and your rights under international law."
              icon="🏛️"
            />
          </div>
        </div>

        {/* How We Can Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold mb-4">Compassionate Guidance</h2>
            <p className="text-gray-600 mb-4">
              We understand that seeking protection is one of the most difficult decisions anyone can make. Our approach is:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Confidential and respectful of your privacy</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Based on current international protection laws</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Focused on your safety and wellbeing</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Safe & Confidential</h3>
                <p className="text-gray-600 mt-2">
                  Your information is protected. We provide guidance while respecting the sensitive nature of your situation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Understanding the Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard 
              step="1"
              title="Initial Assessment"
              description="Understand your situation and determine if you may qualify for protection under international law."
            />
            <StepCard 
              step="2"
              title="Document Preparation"
              description="Guidance on gathering necessary evidence and preparing your application with care."
            />
            <StepCard 
              step="3"
              title="Professional Support"
              description="Connection to qualified legal professionals who specialize in asylum and refugee cases."
            />
          </div>
        </div>

        {/* Important Notice & Professional Help */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border border-orange-200 mb-16">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Professional Legal Assistance</h3>
            <p className="text-gray-600 mb-4">Asylum cases require specialized legal expertise. Let us connect you with qualified professionals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3 mx-auto">
                <span className="text-orange-600 text-xl">⚖️</span>
              </div>
              <h4 className="font-semibold text-center mb-2">Legal Expertise</h4>
              <p className="text-sm text-gray-600 text-center">Connect with lawyers specializing in asylum and refugee law who understand the complexities of protection cases</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3 mx-auto">
                <span className="text-orange-600 text-xl">💬</span>
              </div>
              <h4 className="font-semibold text-center mb-2">Cultural Understanding</h4>
              <p className="text-sm text-gray-600 text-center">Professionals who respect your background and understand the unique challenges you may face</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div>
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90" 
                asChild
              >
                <Link href="/experts">Request Professional Assistance</Link>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Free initial consultation to understand your options
              </p>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-600 hover:bg-blue-50" 
                asChild
              >
                <Link href="/kyc">Get General Guidance First</Link>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Start with our AI assistant for basic information
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You don't have to navigate this alone. We're here to help guide you with compassion and expertise.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 text-white hover:opacity-90" asChild>
            <Link href="/kyc">Begin Your Safe Journey <span className="ml-2">🕊️</span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
