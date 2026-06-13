import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Japa Genie African Migration Index 2026 — Easiest Countries for Africans to Migrate To | Japa Genie',
  description: 'The definitive 2026 ranking of the easiest countries for Nigerians, Ghanaians, Kenyans and Africans to migrate to. Ranked by visa difficulty, cost, processing time, rejection rate and PR pathway.',
  openGraph: {
    title: 'African Migration Index 2026 — Easiest Countries for Africans | Japa Genie',
    description: 'Japa Genie ranks the 20 best countries for African immigrants in 2026 by visa difficulty, cost, processing time and long-term pathway.',
    url: 'https://japagenie.com/resources/african-migration-index-2026',
    siteName: 'Japa Genie',
    type: 'article',
  },
  alternates: { canonical: 'https://japagenie.com/resources/african-migration-index-2026' },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the easiest country for Nigerians to migrate to in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Canada ranks as the easiest high-income country for Nigerians to migrate to in 2026 based on: no occupation list restriction for Express Entry, the lowest government fees among major destinations (CAD $1,610), fast processing (5-8 months after ITA), and a clear 3-year citizenship pathway. Portugal ranks highest among European countries due to its D7 and Digital Nomad visas which do not require a job offer. Serbia ranks as the easiest overall for short-term relocation due to minimal requirements and low cost of living."
      }
    },
    {
      "@type": "Question",
      "name": "Which countries accept Africans most easily for immigration?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Based on the Japa Genie African Migration Index 2026, the top 5 most accessible countries for African immigrants are: 1) Canada — points-based, no occupation restriction, fast PR; 2) Portugal — D7 and Digital Nomad visas with no job offer needed; 3) Germany — Opportunity Card job seeker visa, active labour shortage recruitment; 4) Serbia — work permit with minimal requirements, very low cost; 5) Romania — EU work permit gateway, accessible to African professionals. All offer legal pathways to long-term residence."
      }
    },
    {
      "@type": "Question",
      "name": "Which country is cheapest for Nigerians to migrate to?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Serbia is the cheapest overall migration destination for Nigerians in 2026 — government fees under €200, no language requirement, cost of living as low as €600-800/month in Belgrade. Among high-income English-speaking countries, Canada is cheapest at CAD $1,610 in government fees. Portugal's D7 visa is the cheapest European option for remote workers — under €300 in fees. Australia is the most expensive with government fees of AUD $4,640 per adult."
      }
    },
    {
      "@type": "Question",
      "name": "Which country gives the fastest PR for Africans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Canada gives the fastest permanent residency for Africans — Express Entry PR decisions average 5-8 months after receiving an Invitation to Apply. Ireland offers PR (Stamp 4) after just 2 years on a Critical Skills permit. Portugal's D7 visa converts to permanent residence after 5 years but with some of the most accessible entry requirements. Australia's Subclass 189 averages 6-12 months but the total process from start to PR is typically 18-24 months."
      }
    },
    {
      "@type": "Question",
      "name": "Can Africans get EU citizenship through Eastern European countries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — Romania, Serbia (EU candidate state), and Hungary offer accessible work permit pathways. Romania is an EU member, so working legally there for 5 years leads to Romanian (EU) citizenship, giving freedom of movement across all 27 EU states. Serbia is not yet an EU member but has candidate status and a very accessible work permit system. Some Africans use Romania or Bulgaria as an EU gateway — work permit, then PR, then EU citizenship, then relocate within the EU."
      }
    }
  ]
};

const indexData = [
  {
    rank: 1,
    country: 'Canada',
    flag: '🇨🇦',
    score: 94,
    visaDifficulty: 'Medium',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: 'CAD $2,500–3,500',
    processing: '12–18 months total',
    prPathway: '3 yrs to citizenship',
    jobOffer: 'Not required',
    english: 'Yes',
    topRoute: 'Express Entry',
    forWho: 'Engineers, nurses, IT, finance, teachers',
    rating: '★★★★★',
  },
  {
    rank: 2,
    country: 'Portugal',
    flag: '🇵🇹',
    score: 88,
    visaDifficulty: 'Easy',
    difficultyColor: 'text-green-600 bg-green-50',
    cost: '€1,500–3,000',
    processing: '2–4 months',
    prPathway: '5 yrs to EU citizenship',
    jobOffer: 'Not required (D7/D8)',
    english: 'No',
    topRoute: 'D7 / Digital Nomad D8',
    forWho: 'Remote workers, freelancers, passive income',
    rating: '★★★★★',
  },
  {
    rank: 3,
    country: 'Germany',
    flag: '🇩🇪',
    score: 85,
    visaDifficulty: 'Medium',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: '€3,000–5,000',
    processing: '3–6 months',
    prPathway: '5 yrs to PR, 8 yrs citizenship',
    jobOffer: 'Not required (Opportunity Card)',
    english: 'Partial (IT roles)',
    topRoute: 'Opportunity Card / Skilled Worker',
    forWho: 'Nurses, engineers, IT, trades',
    rating: '★★★★☆',
  },
  {
    rank: 4,
    country: 'United Kingdom',
    flag: '🇬🇧',
    score: 82,
    visaDifficulty: 'Medium',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: '£4,000–6,000',
    processing: '8–12 weeks',
    prPathway: '5 yrs to ILR, 6 yrs citizenship',
    jobOffer: 'Required',
    english: 'Yes',
    topRoute: 'Skilled Worker Visa',
    forWho: 'Healthcare, tech, engineering, care workers',
    rating: '★★★★☆',
  },
  {
    rank: 5,
    country: 'Australia',
    flag: '🇦🇺',
    score: 80,
    visaDifficulty: 'Medium-Hard',
    difficultyColor: 'text-orange-600 bg-orange-50',
    cost: 'AUD $6,000–9,000',
    processing: '14–24 months total',
    prPathway: '4 yrs to citizenship',
    jobOffer: 'Not required (189)',
    english: 'Yes',
    topRoute: 'Skilled Independent (189)',
    forWho: 'Nurses, engineers, IT, tradespeople',
    rating: '★★★★☆',
  },
  {
    rank: 6,
    country: 'Ireland',
    flag: '🇮🇪',
    score: 79,
    visaDifficulty: 'Medium',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: '€3,000–5,000',
    processing: '3–5 months',
    prPathway: '2 yrs to Stamp 4, 5 yrs citizenship',
    jobOffer: 'Required',
    english: 'Yes',
    topRoute: 'Critical Skills Employment Permit',
    forWho: 'Nurses, IT professionals, engineers',
    rating: '★★★★☆',
  },
  {
    rank: 7,
    country: 'Netherlands',
    flag: '🇳🇱',
    score: 77,
    visaDifficulty: 'Medium',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: '€3,000–5,000',
    processing: '2–3 months',
    prPathway: '5 yrs to PR, 5 yrs citizenship',
    jobOffer: 'Required',
    english: 'Yes (most roles)',
    topRoute: 'Highly Skilled Migrant (Kennismigrant)',
    forWho: 'Tech, finance, engineering, oil & gas',
    rating: '★★★★☆',
  },
  {
    rank: 8,
    country: 'Finland',
    flag: '🇫🇮',
    score: 74,
    visaDifficulty: 'Medium',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: '€3,000–5,000',
    processing: '3–9 months',
    prPathway: '4 yrs to PR, 5 yrs citizenship',
    jobOffer: 'Required',
    english: 'Yes (tech sector)',
    topRoute: 'Work Residence Permit',
    forWho: 'IT, engineering, healthcare',
    rating: '★★★★☆',
  },
  {
    rank: 9,
    country: 'New Zealand',
    flag: '🇳🇿',
    score: 73,
    visaDifficulty: 'Medium',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: 'NZD $3,000–5,000',
    processing: '6–12 months',
    prPathway: '5 yrs to citizenship',
    jobOffer: 'Not required (Skilled Migrant)',
    english: 'Yes',
    topRoute: 'Skilled Migrant Category',
    forWho: 'Nurses, engineers, IT, trades',
    rating: '★★★☆☆',
  },
  {
    rank: 10,
    country: 'Malta',
    flag: '🇲🇹',
    score: 72,
    visaDifficulty: 'Medium',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: '€3,000–5,000',
    processing: '3–6 months',
    prPathway: '5 yrs to PR (EU)',
    jobOffer: 'Required (Key Employee)',
    english: 'Yes',
    topRoute: 'Key Employee Initiative',
    forWho: 'iGaming, tech, finance professionals',
    rating: '★★★☆☆',
  },
  {
    rank: 11,
    country: 'Romania',
    flag: '🇷🇴',
    score: 70,
    visaDifficulty: 'Easy-Medium',
    difficultyColor: 'text-green-600 bg-green-50',
    cost: '€1,500–2,500',
    processing: '2–4 months',
    prPathway: '5 yrs to PR → EU citizenship',
    jobOffer: 'Required',
    english: 'Partial',
    topRoute: 'Romanian Work Permit',
    forWho: 'Construction, IT, healthcare, manufacturing',
    rating: '★★★☆☆',
  },
  {
    rank: 12,
    country: 'Cyprus',
    flag: '🇨🇾',
    score: 68,
    visaDifficulty: 'Easy-Medium',
    difficultyColor: 'text-green-600 bg-green-50',
    cost: '€2,000–4,000',
    processing: '2–4 months',
    prPathway: '5 yrs to PR (EU)',
    jobOffer: 'Required',
    english: 'Yes',
    topRoute: 'Work Permit (Category E)',
    forWho: 'Finance, tech, hospitality professionals',
    rating: '★★★☆☆',
  },
  {
    rank: 13,
    country: 'Japan',
    flag: '🇯🇵',
    score: 65,
    visaDifficulty: 'Hard',
    difficultyColor: 'text-red-600 bg-red-50',
    cost: '¥400k–700k',
    processing: '3–6 months',
    prPathway: '10 yrs (5 yrs for HSP)',
    jobOffer: 'Required (most routes)',
    english: 'Partial (IT only)',
    topRoute: 'Specified Skilled Worker / HSP',
    forWho: 'IT, nursing, engineering, English teachers',
    rating: '★★★☆☆',
  },
  {
    rank: 14,
    country: 'UAE',
    flag: '🇦🇪',
    score: 62,
    visaDifficulty: 'Medium (tourist restricted)',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    cost: '$2,500–4,000',
    processing: '2–6 weeks',
    prPathway: 'No traditional PR pathway',
    jobOffer: 'Required (work visa)',
    english: 'Yes',
    topRoute: 'Employment Visa / Golden Visa',
    forWho: 'Finance, oil & gas, tech, hospitality',
    rating: '★★★☆☆',
  },
  {
    rank: 15,
    country: 'Serbia',
    flag: '🇷🇸',
    score: 78,
    visaDifficulty: 'Easy',
    difficultyColor: 'text-green-600 bg-green-50',
    cost: '€800–1,500',
    processing: '1–3 months',
    prPathway: '5 yrs to permanent residence',
    jobOffer: 'Required',
    english: 'Partial',
    topRoute: 'Work Permit / Temporary Residence',
    forWho: 'IT professionals, remote workers, entrepreneurs',
    rating: '★★★☆☆',
  },
].sort((a, b) => a.rank - b.rank);

export default function AfricanMigrationIndex() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🌍</div>
            <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Japa Genie African Migration Index — June 2026 Edition
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Easiest Countries for Africans to Migrate To in 2026
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Japa Genie ranks 15 countries by how accessible they are for Nigerian, Ghanaian, Kenyan, and African immigrants — using visa difficulty, total cost, processing time, rejection rate, and long-term PR pathway as scoring criteria.
            </p>
          </div>

          {/* Methodology */}
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              How We Ranked These Countries
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              The Japa Genie African Migration Index scores each country across 6 factors, weighted by importance to African applicants:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { factor: 'Visa accessibility', weight: '25%', desc: 'No job offer needed, no occupation list, open to African nationalities' },
                { factor: 'Total cost', weight: '20%', desc: 'Government fees, credential assessment, IELTS, and living costs during process' },
                { factor: 'Processing speed', weight: '20%', desc: 'Total time from starting the process to arriving legally' },
                { factor: 'PR / citizenship pathway', weight: '20%', desc: 'How clear and fast the route to permanent residency or citizenship is' },
                { factor: 'African rejection rate', weight: '10%', desc: 'Historical refusal rate for Nigerian/African applicants' },
                { factor: 'Quality of life', weight: '5%', desc: 'Safety, healthcare, Nigerian community size, English prevalence' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-gray-900 text-sm">{item.factor}</div>
                  <div className="text-blue-600 font-bold text-xs mb-1">{item.weight}</div>
                  <div className="text-gray-500 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {indexData.slice(0, 3).map((country) => (
              <div key={country.rank} className={`rounded-xl p-6 text-center shadow-sm border ${
                country.rank === 1 ? 'bg-yellow-50 border-yellow-200' :
                country.rank === 2 ? 'bg-gray-50 border-gray-200' :
                'bg-orange-50 border-orange-200'
              }`}>
                <div className="text-3xl mb-1">{country.rank === 1 ? '🥇' : country.rank === 2 ? '🥈' : '🥉'}</div>
                <div className="text-4xl mb-2">{country.flag}</div>
                <div className="font-bold text-xl text-gray-900">{country.country}</div>
                <div className="text-blue-600 font-black text-2xl my-2">{country.score}/100</div>
                <div className="text-xs text-gray-500">{country.topRoute}</div>
                <div className="text-xs text-gray-400 mt-1">{country.rating}</div>
              </div>
            ))}
          </div>

          {/* Full index table */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">Full African Migration Index 2026</h2>
            <div className="space-y-4">
              {indexData.map((country) => (
                <div key={country.rank} className="border border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                      #{country.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="font-bold text-gray-900 text-lg">{country.country}</span>
                        <span className="font-black text-blue-600">{country.score}/100</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${country.difficultyColor}`}>
                          {country.visaDifficulty}
                        </span>
                        <span className="text-yellow-500 text-sm">{country.rating}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {[
                          { label: 'Est. Cost', value: country.cost },
                          { label: 'Processing', value: country.processing },
                          { label: 'Job Offer', value: country.jobOffer },
                          { label: 'Top Route', value: country.topRoute },
                        ].map((stat, i) => (
                          <div key={i}>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
                            <div className="text-sm font-semibold text-gray-800">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Best for: </span>
                          <span className="text-sm text-gray-700">{country.forWho}</span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-gray-500">{country.prPathway}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key insights */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">Key Insights from the 2026 Index</h2>
            <div className="space-y-4">
              {[
                {
                  insight: 'Canada remains the best overall destination for most African professionals',
                  detail: 'No occupation restriction, fastest PR among English-speaking destinations, lowest fees, and a 3-year citizenship pathway make Canada the default recommendation for most Nigerian, Ghanaian, and Kenyan professionals in 2026.',
                },
                {
                  insight: 'Portugal is the hidden gem for remote workers and freelancers',
                  detail: 'The D7 and D8 Digital Nomad visas are uniquely accessible — they require no job offer, no employer sponsor, and relatively low income thresholds. Once in Portugal, the path to EU citizenship (and freedom of movement across 27 countries) is 5 years.',
                },
                {
                  insight: 'Eastern Europe is the underused gateway for Africans',
                  detail: 'Romania and Serbia have far lower barriers than Western Europe. Romania as an EU member offers a work permit that leads directly to EU citizenship in 5 years — meaning you can eventually relocate anywhere in the EU. Very few African immigration advisors are talking about this.',
                },
                {
                  insight: 'The UAE is best for wealth-building, not long-term settlement',
                  detail: 'Zero income tax and high salaries make the UAE excellent for accumulating capital. But the lack of a traditional PR pathway and the 2023 tourist visa restrictions mean it is better treated as a 5-10 year wealth building stop than a permanent home.',
                },
                {
                  insight: 'Germany is rising fast for African professionals',
                  detail: 'The Opportunity Card launched in 2024 gives Africans with points on the scoring system the right to enter Germany and job-search for 1 year without a job offer first. Combined with Germany\'s critical labour shortage, this is increasingly attractive for Nigerian nurses, engineers, and IT workers.',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{item.insight}</div>
                    <div className="text-gray-600 text-sm">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning section */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Important: Rankings Change — Verify Before You Apply</h3>
                <p className="text-sm text-amber-800">
                  Immigration rules change frequently. The UK raised its Skilled Worker salary threshold in April 2024. UAE restricted tourist visas for Nigerians in 2023. Canada has adjusted Express Entry draws multiple times. Always verify current requirements directly with the destination country immigration authority before submitting any application. Japa Genie updates this index quarterly — bookmark it and check back.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>
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
            <h2 className="text-2xl font-bold mb-4">Explore Top-Ranked Country Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { href: '/visa-guide/nigeria-to-canada', label: '🇨🇦 Nigeria to Canada Full Guide 2026', desc: 'Express Entry, CRS, proof of funds' },
                { href: '/visa-guide/nigeria-to-portugal', label: '🇵🇹 Nigeria to Portugal Full Guide 2026', desc: 'D7, Digital Nomad, Job Seeker visa' },
                { href: '/visa-guide/nigeria-to-germany', label: '🇩🇪 Nigeria to Germany Full Guide 2026', desc: 'Opportunity Card, Job Seeker visa' },
                { href: '/comparisons/canada-vs-australia-nigerians', label: '🇨🇦 vs 🇦🇺 Canada vs Australia 2026', desc: 'Which is better for your profile?' },
                { href: '/visa-guide/nigeria-to-uk', label: '🇬🇧 Nigeria to UK Full Guide 2026', desc: 'Skilled Worker visa, NHS surcharge' },
                { href: '/resources/canada-proof-of-funds-nigerians', label: '💰 Canada Proof of Funds Guide', desc: 'Exact CAD amounts, bank letter format' },
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
            <h2 className="text-2xl font-bold mb-4">Find Out Which Country Is Right for Your Profile</h2>
            <p className="mb-2 opacity-90 max-w-xl mx-auto">
              The index shows the best countries overall. Japa Genie tells you the best country for YOU — based on your profession, qualifications, IELTS score, finances, and timeline.
            </p>
            <p className="text-sm opacity-75 mb-6">Free personalised analysis. Takes 3 minutes.</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
              <a href="/kyc" className="flex items-center gap-2">
                Get My Personalised Country Match <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

        </div>
      </section>
    </>
  );
}
