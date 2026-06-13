import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, AlertCircle, Clock, DollarSign, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'South Africa to Japan Visa Guide 2026 — Requirements, Costs and Timeline | Japa Genie',
  description: 'Complete South Africa to Japan immigration guide 2026. Visa requirements, proof of funds, processing times and step-by-step guide for Africans.',
  openGraph: { title: 'South Africa to Japan Visa Guide 2026 | Japa Genie', description: 'Complete South Africa to Japan immigration guide 2026.', url: 'https://japagenie.com/visa-guide/south-africa-to-japan', siteName: 'Japa Genie', type: 'article' },
  alternates: { canonical: 'https://japagenie.com/visa-guide/south-africa-to-japan' },
};

export default function VisaGuide() {
  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🇿🇦 → 🇯🇵</div>
          <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">Updated June 2026</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">South Africa to Japan Visa Guide 2026</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to move from South Africa to Japan in 2026 — visa routes, proof of funds, real costs, and step-by-step guidance for African applicants.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl p-5 shadow-sm border text-center"><DollarSign className="w-7 h-7 text-blue-600 mx-auto mb-2" /><div className="text-xl font-bold">¥400k-¥700k</div><div className="text-xs text-gray-500 mt-1">Est. Total Cost</div></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border text-center"><Clock className="w-7 h-7 text-blue-600 mx-auto mb-2" /><div className="text-xl font-bold">3-6 months</div><div className="text-xs text-gray-500 mt-1">Processing Time</div></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border text-center"><CheckCircle className="w-7 h-7 text-green-600 mx-auto mb-2" /><div className="text-xl font-bold">Work Visa / SSW</div><div className="text-xs text-gray-500 mt-1">Top Visa Route</div></div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
          <h2 className="text-2xl font-bold mb-6">Core Requirements</h2>
          <div className="space-y-3">
            {['Valid passport — minimum 6 months validity, at least 2 blank pages','Proof of funds — ¥200,000+ per month to cover living costs','Language — JLPT N4 minimum for SSW. English accepted for IT/HSP route','Educational qualifications and professional certifications (apostilled/attested)','Police clearance certificate from your home country police authority','Medical examination clearance from an approved health provider','Completed visa application with all supporting documents'].map((req, i) => (
              <div key={i} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span className="text-gray-700 text-sm">{req}</span></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
          <h2 className="text-2xl font-bold mb-6">Why Applications Get Refused</h2>
          <div className="space-y-3">
            {['Insufficient or improperly seasoned proof of funds','Inconsistent information between application and documents','Weak ties to home country — officer suspects overstay intent','Missing or incorrectly certified documents','Previous visa violations or immigration history issues','Misrepresentation — leads to multi-year bans'].map((r, i) => (
              <div key={i} className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><span className="text-gray-700 text-sm">{r}</span></div>
            ))}
          </div>
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800"><strong>African applicant note:</strong> Applications from Nigeria, Ghana, Kenya and other African countries face additional scrutiny. Ensure every document is certified and bank statements show consistent seasoned funds over at least 6 months — not recent large deposits.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
          <h2 className="text-2xl font-bold mb-6">Step-by-Step Application</h2>
          <div className="space-y-5">
            {[{s:'1',t:'Confirm Eligibility',d:'Check your qualifications, language scores, finances, and work experience against your target visa category.'},{s:'2',t:'Season Your Proof of Funds',d:'Build your bank balance consistently over 6+ months. Avoid large unexplained deposits. Get a formal bank letter — not just statements.'},{s:'3',t:'Gather and Certify Documents',d:'Collect qualifications, employment records, and ID. Get documents apostilled or notarised as required by the destination country.'},{s:'4',t:'Submit Application',d:'Complete the form accurately. One inconsistency between your form and documents can trigger a refusal.'},{s:'5',t:'Biometrics and Interview',d:'Attend your appointment with originals of all submitted documents. Be fully honest and consistent.'},{s:'6',t:'Await Decision',d:'Track your application. Respond quickly to any embassy requests. Prepare your settlement plan before departure.'}].map((item) => (
              <div key={item.s} className="flex gap-4"><div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.s}</div><div><div className="font-semibold text-gray-900">{item.t}</div><div className="text-gray-600 text-sm mt-1">{item.d}</div></div></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
          <h2 className="text-2xl font-bold mb-4">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="/visa-guide/nigeria-to-canada" className="flex items-start gap-3 p-4 border rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"><div><div className="font-semibold text-sm group-hover:text-blue-700">🇨🇦 Nigeria to Canada 2026</div><div className="text-xs text-gray-500">Express Entry, CRS scores</div></div><ArrowRight className="w-4 h-4 text-gray-400 ml-auto mt-0.5" /></a>
            <a href="/visa-guide/nigeria-to-uk" className="flex items-start gap-3 p-4 border rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"><div><div className="font-semibold text-sm group-hover:text-blue-700">🇬🇧 Nigeria to UK 2026</div><div className="text-xs text-gray-500">Skilled Worker visa</div></div><ArrowRight className="w-4 h-4 text-gray-400 ml-auto mt-0.5" /></a>
            <a href="/visa-guide/nigeria-to-germany" className="flex items-start gap-3 p-4 border rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"><div><div className="font-semibold text-sm group-hover:text-blue-700">🇩🇪 Nigeria to Germany 2026</div><div className="text-xs text-gray-500">Opportunity Card</div></div><ArrowRight className="w-4 h-4 text-gray-400 ml-auto mt-0.5" /></a>
            <a href="/resources/african-migration-index-2026" className="flex items-start gap-3 p-4 border rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"><div><div className="font-semibold text-sm group-hover:text-blue-700">🌍 African Migration Index 2026</div><div className="text-xs text-gray-500">Best countries ranked for Africans</div></div><ArrowRight className="w-4 h-4 text-gray-400 ml-auto mt-0.5" /></a>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Get Your Personalised South Africa to Japan Roadmap</h2>
          <p className="mb-2 opacity-90 max-w-xl mx-auto">Japa Genie analyses your profile and gives you a personalised visa strategy with exact requirements and next steps.</p>
          <p className="text-sm opacity-75 mb-6">Free eligibility check. No agent fees. No spam.</p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
            <a href="/kyc" className="flex items-center gap-2">Check My Eligibility Free <ArrowRight className="w-4 h-4" /></a>
          </Button>
        </div>
      </div>
    </section>
  );
}
