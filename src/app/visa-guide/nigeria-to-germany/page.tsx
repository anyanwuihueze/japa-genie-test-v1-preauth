import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, AlertCircle, Clock, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nigeria to Germany Visa Guide 2025 — Requirements, Costs & Timeline | Japa Genie',
  description: 'Complete Nigeria to Germany visa guide for 2025. Visa requirements, proof of funds, processing times, hidden costs and step-by-step application guide.',
  openGraph: {
    title: 'Nigeria to Germany Visa Guide 2025 | Japa Genie',
    description: 'Complete Nigeria to Germany visa guide for 2025.',
    url: 'https://japagenie.com/visa-guide/nigeria-to-germany',
    siteName: 'Japa Genie',
    type: 'article',
  },
  alternates: {
    canonical: 'https://japagenie.com/visa-guide/nigeria-to-germany',
  }
};

export default function VisaGuide() {
  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🇩🇪</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Nigeria to Germany Visa Guide 2025
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about moving from Nigeria to Germany — visa requirements, proof of funds, costs, and timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">$1,800</div>
            <div className="text-sm text-gray-500 mt-1">Estimated Total Cost</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">8-16 weeks</div>
            <div className="text-sm text-gray-500 mt-1">Processing Time</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">Opportunity Card</div>
            <div className="text-sm text-gray-500 mt-1">Top Visa Category</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-6">Core Requirements</h2>
          <div className="space-y-4">
            {[
              'Valid passport with at least 6 months validity beyond intended stay',
              'Proof of funds — bank statements seasoned for minimum 3-6 months',
              'Employment offer or evidence of self-sufficiency depending on visa type',
              'Educational qualifications and professional certifications',
              'Clean criminal record certificate from country of origin',
              'Medical examination clearance from approved health provider',
              'Completed visa application form with correct supporting documents',
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-6">Common Rejection Reasons</h2>
          <div className="space-y-4">
            {[
              'Insufficient or improperly seasoned proof of funds',
              'Inconsistent information between application and supporting documents',
              'Weak ties to home country suggesting intention to overstay',
              'Incomplete documentation or missing required certificates',
              'Previous visa violations or immigration history issues',
            ].map((reason, i) => (
              <div key={i} className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-6">Step-by-Step Application Process</h2>
          <div className="space-y-6">
            {[
              { step: '1', title: 'Assess Your Eligibility', desc: 'Check your qualifications, language requirements, and financial standing against the specific visa category requirements.' },
              { step: '2', title: 'Build Your Proof of Funds', desc: 'Season your bank account for at least 3 months. Ensure funds are consistent, explainable, and well-documented.' },
              { step: '3', title: 'Gather Your Documents', desc: 'Collect all required certificates, qualifications, employment records, and identification documents.' },
              { step: '4', title: 'Submit Your Application', desc: 'Complete the application form accurately and submit with all supporting documents. Double-check everything before submission.' },
              { step: '5', title: 'Attend Biometrics and Interview', desc: 'Attend your biometrics appointment and any required visa interview at the consulate or embassy.' },
              { step: '6', title: 'Await Decision', desc: 'Processing times vary. Track your application status and respond promptly to any requests for additional information.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="text-gray-600 text-sm mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Get Your Personalised Nigeria to Germany Roadmap</h2>
          <p className="mb-6 opacity-90">
            Japa Genie will analyse your specific profile — profession, age, finances, and timeline — and give you a personalised visa strategy with exact proof of funds requirements and step-by-step guidance.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
            <a href="/kyc" className="flex items-center gap-2">
              Check My Eligibility Free <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
