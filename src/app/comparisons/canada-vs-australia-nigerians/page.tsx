import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Canada vs Australia for Nigerians 2026 — Which Country is Better? | Japa Genie',
  description: 'Canada vs Australia immigration for Nigerians 2026. Detailed comparison of points systems, proof of funds, processing times, salaries, PR pathways and citizenship. Find out which is right for your profile.',
  openGraph: {
    title: 'Canada vs Australia for Nigerians 2026 | Japa Genie',
    description: 'Which is better for Nigerian immigrants — Canada or Australia? Full 2026 comparison of costs, timelines, salaries and PR pathways.',
    url: 'https://japagenie.com/comparisons/canada-vs-australia-nigerians',
    siteName: 'Japa Genie',
    type: 'article',
  },
  alternates: { canonical: 'https://japagenie.com/comparisons/canada-vs-australia-nigerians' },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Canada or Australia better for Nigerian immigrants in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Canada is generally better for most Nigerian professionals in 2026 because: it has more PR spots (395,000 vs Australia's 190,000), Express Entry does not require your occupation to be on a shortage list, processing is faster (5-8 months vs 6-18 months), and the proof of funds requirement (CAD $15,263) is lower than Australia's financial expectations. Australia is better if you are in a high-demand occupation on the Skills in Demand list, you prefer warmer climate, or you want higher raw salaries (AUD salaries are typically 10-15% higher than equivalent Canadian roles)."
      }
    },
    {
      "@type": "Question",
      "name": "What are the points requirements for Canada vs Australia for Nigerians?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Canada Express Entry: minimum 67 points to enter the pool, but CRS cutoff scores for general draws run 475-515 in 2026. Category-based draws can go as low as 420-480. Australia SkillSelect: minimum 65 points to submit an EOI, but most occupations require 85-95+ points to receive an invitation. Australia's system is occupation-driven — if your job is not on the Skilled Occupation List, points do not matter. Canada's system accepts any TEER 0-3 occupation."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to immigrate to Canada vs Australia from Nigeria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Canada Express Entry total government fees: CAD $1,610 per adult (processing fee CAD $950 + RPRF CAD $575 + biometrics CAD $85). Plus IELTS (~CAD $277), WES ECA (~CAD $280), medical (~CAD $200). Total: CAD $2,500-3,500 per applicant. Australia Subclass 189: AUD $4,640 government fee per primary applicant. Plus IELTS, skills assessment (AUD $300-800 depending on body), medical. Total: AUD $6,000-8,000 per applicant. Canada is significantly cheaper in government fees."
      }
    },
    {
      "@type": "Question",
      "name": "Which is faster — Canada or Australia PR for Nigerians?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Canada is faster. Express Entry PR decision after ITA: 5-8 months. Australia Subclass 189: 6-12 months, with some high-priority occupations processed in under 70 days. However, total timeline from starting the process matters more: Canada total (IELTS + WES + profile + ITA + PR): 12-18 months. Australia total (IELTS + skills assessment + EOI + invitation + PR): 14-24 months. Canada wins on speed for most Nigerian applicants."
      }
    },
    {
      "@type": "Question",
      "name": "Are salaries higher in Canada or Australia for Nigerians?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Australia has higher raw salaries in most fields. A software engineer earns AUD $90,000-130,000 in Australia vs CAD $80,000-110,000 in Canada. However, Australian employers also contribute 11.5% superannuation (pension) on top of salary — adding significant value. Canadian salaries have lower income tax in provinces like Alberta and Ontario vs Australian states. Purchasing power depends heavily on city: Melbourne is comparable to Toronto; Sydney and Vancouver are the most expensive cities in their respective countries."
      }
    },
    {
      "@type": "Question",
      "name": "Which country gives citizenship faster — Canada or Australia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Canada: citizenship after 3 years of physical presence (out of 5 years as PR). You can hold dual Canadian-Nigerian nationality. Australia: citizenship after 4 years of residence including 1 year as PR. Australia also allows dual nationality. Canada is 1 year faster for citizenship. Both passports are among the world's most powerful, giving visa-free access to 180+ countries."
      }
    }
  ]
};

const comparisonData = [
  { factor: 'Annual PR spots', canada: '395,000 (2026)', australia: '190,000 (2026)', winner: 'canada' },
  { factor: 'Min. points to enter pool', canada: '67 pts (CRS)', australia: '65 pts (SkillSelect)', winner: 'tie' },
  { factor: 'Competitive score needed', canada: '475–515 CRS', australia: '85–95+ pts', winner: 'canada' },
  { factor: 'Occupation list required?', canada: 'No (any TEER 0–3)', australia: 'Yes (skills list)', winner: 'canada' },
  { factor: 'Govt fees (single adult)', canada: 'CAD $1,610', australia: 'AUD $4,640', winner: 'canada' },
  { factor: 'IELTS minimum', canada: 'CLB 7 (IELTS 6.0)', australia: 'IELTS 6.0 each band', winner: 'tie' },
  { factor: 'Credential assessment', canada: 'WES (~CAD $280)', australia: 'Varies by body (AUD $300–800)', winner: 'canada' },
  { factor: 'PR processing time', canada: '5–8 months (after ITA)', australia: '6–12 months', winner: 'canada' },
  { factor: 'Job offer required?', canada: 'No (FSW/CEC)', australia: 'No (189 visa)', winner: 'tie' },
  { factor: 'Avg. software eng. salary', canada: 'CAD $90,000–110,000', australia: 'AUD $100,000–130,000', winner: 'australia' },
  { factor: 'Avg. nurse salary', canada: 'CAD $70,000–90,000', australia: 'AUD $75,000–95,000', winner: 'australia' },
  { factor: 'Employer pension contribution', canada: 'CPP (~5.95%)', australia: 'Super (11.5%)', winner: 'australia' },
  { factor: 'Citizenship timeline', canada: '3 yrs physical presence', australia: '4 yrs (incl. 1 yr as PR)', winner: 'canada' },
  { factor: 'Dual nationality allowed?', canada: 'Yes', australia: 'Yes', winner: 'tie' },
  { factor: 'Winter climate', canada: 'Harsh (–20°C possible)', australia: 'Mild to warm', winner: 'australia' },
  { factor: 'Nigerian community size', canada: 'Large (250,000+)', australia: 'Growing (80,000+)', winner: 'canada' },
];

export default function CanadaVsAustralia() {
  const canadaWins = comparisonData.filter(d => d.winner === 'canada').length;
  const australiaWins = comparisonData.filter(d => d.winner === 'australia').length;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🇨🇦 vs 🇦🇺</div>
            <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Updated June 2026 — 2026 IRCC & Home Affairs data
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Canada vs Australia for Nigerian Immigrants 2026
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The definitive comparison for Nigerians deciding between Canada and Australia. Real data on points systems, proof of funds, salaries, processing times, PR pathways and citizenship.
            </p>
          </div>

          {/* Quick verdict */}
          <div className="bg-blue-600 text-white rounded-xl p-8 mb-10">
            <h2 className="text-xl font-bold mb-4 text-center">The Quick Verdict</h2>
            <div className="grid grid-cols-2 gap-6 text-center mb-6">
              <div>
                <div className="text-4xl font-black mb-1">{canadaWins}</div>
                <div className="text-sm opacity-80">factors Canada wins</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-1">{australiaWins}</div>
                <div className="text-sm opacity-80">factors Australia wins</div>
              </div>
            </div>
            <p className="text-sm opacity-90 text-center max-w-xl mx-auto">
              <strong>Canada wins for most Nigerians</strong> — faster processing, lower fees, more PR spots, no occupation list restriction. Australia wins on raw salaries and climate. Your best choice depends on your occupation and priorities.
            </p>
          </div>

          {/* Full comparison table */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">Full Side-by-Side Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700 w-1/3">Factor</th>
                    <th className="text-left p-3 font-semibold text-blue-700">🇨🇦 Canada</th>
                    <th className="text-left p-3 font-semibold text-yellow-700">🇦🇺 Australia</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 text-gray-700 font-medium">{row.factor}</td>
                      <td className={`p-3 ${row.winner === 'canada' ? 'text-blue-700 font-bold' : 'text-gray-600'}`}>
                        {row.winner === 'canada' && <span className="mr-1">✅</span>}{row.canada}
                      </td>
                      <td className={`p-3 ${row.winner === 'australia' ? 'text-yellow-700 font-bold' : 'text-gray-600'}`}>
                        {row.winner === 'australia' && <span className="mr-1">✅</span>}{row.australia}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Who should pick Canada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <h3 className="text-lg font-bold text-blue-700 mb-4">🇨🇦 Choose Canada if...</h3>
              <div className="space-y-3">
                {[
                  'Your occupation is not on a specific shortage list — Canada accepts any TEER 0-3 role',
                  'You want the fastest route to PR — Express Entry averages 5-8 months after ITA',
                  'You want lower upfront government fees (CAD $1,610 vs AUD $4,640)',
                  'You already have a strong IELTS score and Canadian-equivalent degree',
                  'You want citizenship in 3 years (vs 4 in Australia)',
                  'You want to join a large established Nigerian community (250,000+)',
                  'You are interested in Provincial Nominee Programs as a backup route',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-100">
              <h3 className="text-lg font-bold text-yellow-700 mb-4">🇦🇺 Choose Australia if...</h3>
              <div className="space-y-3">
                {[
                  'Your occupation is on Australia\'s Skills in Demand list (nurses, engineers, IT)',
                  'You prioritise higher raw salary — AUD salaries run 10-15% above equivalent CAD',
                  'You want warmer climate — no harsh Canadian winters',
                  'You have 85+ points on Australia\'s SkillSelect system already',
                  'You prefer state nomination (190 visa) which can lower points needed',
                  'You are a healthcare worker — Australia actively recruits Nigerian nurses',
                  'You are in a trade or construction role with strong Australian demand',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Salary comparison */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">Salary Comparison: Canada vs Australia 2026</h2>
            <p className="text-gray-600 text-sm mb-6">
              Australia has higher raw salaries across most professional fields. However, Canada has lower income tax in several provinces, and purchasing power varies by city. Australian employers also add 11.5% superannuation on top of salary.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700">Occupation</th>
                    <th className="text-left p-3 font-semibold text-blue-700">🇨🇦 Canada (CAD/yr)</th>
                    <th className="text-left p-3 font-semibold text-yellow-700">🇦🇺 Australia (AUD/yr)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: 'Software Engineer', canada: '$85,000–110,000', aus: '$100,000–130,000' },
                    { role: 'Registered Nurse', canada: '$70,000–90,000', aus: '$75,000–95,000' },
                    { role: 'Civil Engineer', canada: '$75,000–100,000', aus: '$85,000–115,000' },
                    { role: 'Accountant (CPA/CA)', canada: '$70,000–95,000', aus: '$80,000–110,000' },
                    { role: 'General Practitioner (MD)', canada: '$200,000–300,000', aus: '$250,000–350,000' },
                    { role: 'Electrician (Trades)', canada: '$60,000–85,000', aus: '$70,000–95,000' },
                    { role: 'Data Scientist', canada: '$90,000–120,000', aus: '$100,000–135,000' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-800">{row.role}</td>
                      <td className="p-3 text-blue-700">{row.canada}</td>
                      <td className="p-3 text-yellow-700 font-semibold">{row.aus} ✅</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Note: AUD and CAD are near-parity (1 AUD ≈ 0.90 CAD in early 2026). Australian figures exclude 11.5% superannuation contribution from employers. Cost of living is high in both countries — Sydney and Vancouver are among the most expensive cities globally.
            </p>
          </div>

          {/* Profile-based recommendation */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">What Does Your Profile Say?</h2>
            <div className="space-y-4">
              {[
                {
                  profile: 'Nigerian nurse or healthcare worker',
                  rec: 'Australia first, Canada second',
                  reason: 'Australia has critical healthcare shortages and actively recruits Nigerian nurses via AHPRA. State nomination adds 5 points and some states offer priority processing for healthcare. Canada also needs nurses but competition is higher.',
                  flag: '🇦🇺',
                },
                {
                  profile: 'Nigerian software engineer or IT professional',
                  rec: 'Canada first, Australia close second',
                  reason: 'Canada\'s category-based STEM draws regularly invite IT professionals at lower CRS scores. Australia also has strong tech demand but higher government fees. Both are excellent. Canada is faster and cheaper to apply.',
                  flag: '🇨🇦',
                },
                {
                  profile: 'Nigerian civil or structural engineer',
                  rec: 'Australia first for salary, Canada first for speed',
                  reason: 'Engineers Australia assessment is required but well-structured. Australian engineering salaries are higher. Canada\'s Engineers Canada assessment (via WES or Professional Engineers) is also accessible. Choose based on timeline priority.',
                  flag: '⚖️',
                },
                {
                  profile: 'Nigerian teacher or education professional',
                  rec: 'Canada first',
                  reason: 'Teaching is on Canada\'s shortage list in multiple provinces. Provincial nominee programs (especially Saskatchewan and Manitoba) actively recruit teachers. Australian teaching requires state-specific registration which adds complexity.',
                  flag: '🇨🇦',
                },
                {
                  profile: 'Nigerian accountant or finance professional',
                  rec: 'Canada first',
                  reason: 'CPA Canada has a well-defined recognition pathway for Nigerian ICAN/ACCA holders. Express Entry regularly invites financial professionals. Australian CPA/CA recognition is also achievable but the 189 visa competition is higher.',
                  flag: '🇨🇦',
                },
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-bold text-gray-900">{item.flag} {item.profile}</div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full shrink-0">{item.rec}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nigerian-specific warnings */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 mb-3">Nigerian-Specific Considerations for Both Countries</h3>
                <div className="space-y-2">
                  {[
                    'Both IRCC (Canada) and Home Affairs (Australia) apply additional document scrutiny to Nigerian applications. Every certificate must be original or properly apostilled.',
                    'Proof of funds must be seasoned — large deposits 1-2 months before application are red flags in both systems.',
                    'WES (Canada) and NESA/Engineers Australia/AHPRA (Australia) all recognise Nigerian degrees from established institutions — check your specific university first.',
                    'Nigerian police clearance is required for both countries. The Nigeria Police Force NPC portal is the official source — avoid third-party services.',
                    'For Australia, name on passport must exactly match name on all documents. Nigerian passport name variations (e.g. surname/given name order) frequently cause issues — resolve this before applying.',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-amber-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {faqSchema.mainEntity.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { href: '/visa-guide/nigeria-to-canada', label: '🇨🇦 Nigeria to Canada Full Guide 2026', desc: 'Express Entry, proof of funds, CRS scores' },
                { href: '/visa-guide/nigeria-to-australia', label: '🇦🇺 Nigeria to Australia Full Guide 2026', desc: 'Skilled migration, points test, state nomination' },
                { href: '/visa-guide/nigeria-to-uk', label: '🇬🇧 Nigeria to UK 2026', desc: 'Skilled Worker visa, NHS surcharge' },
                { href: '/visa-guide/nigeria-to-germany', label: '🇩🇪 Nigeria to Germany 2026', desc: 'Opportunity Card, Job Seeker Visa' },
              ].map((link) => (
                <a key={link.href} href={link.href} className="flex items-start gap-3 p-4 border rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <div>
                    <div className="font-semibold text-sm group-hover:text-blue-700">{link.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{link.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto mt-0.5 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Still Not Sure? Let Japa Genie Decide For You</h2>
            <p className="mb-2 opacity-90 max-w-xl mx-auto">
              Enter your profession, IELTS score, degree, age, and finances. Japa Genie will tell you exactly which country and which visa pathway gives you the highest chance of success.
            </p>
            <p className="text-sm opacity-75 mb-6">Free eligibility check. Takes 3 minutes.</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
              <a href="/kyc" className="flex items-center gap-2">
                Check My Profile Free <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

        </div>
      </section>
    </>
  );
}
