import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Canada Proof of Funds 2026 — Complete Guide for Nigerians | Japa Genie',
  description: 'Exact Canada proof of funds requirements for Nigerians in 2026. CAD amounts by family size, bank letter format, 6-month seasoning rules, Nigerian-specific red flags and how to avoid refusal.',
  openGraph: {
    title: 'Canada Proof of Funds 2026 — Complete Guide for Nigerians | Japa Genie',
    description: 'Exact CAD amounts, bank letter requirements, seasoning rules and Nigerian-specific tips for Canada Express Entry proof of funds 2026.',
    url: 'https://japagenie.com/resources/canada-proof-of-funds-nigerians',
    siteName: 'Japa Genie',
    type: 'article',
  },
  alternates: { canonical: 'https://japagenie.com/resources/canada-proof-of-funds-nigerians' },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much proof of funds do Nigerians need for Canada Express Entry 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A single Nigerian applicant needs exactly CAD $15,263 for Canada Express Entry in 2026. A couple needs CAD $19,007. A family of four needs CAD $28,362. These figures are based on IRCC's Low Income Cut-Off (LICO) updated in July 2025. Always maintain a buffer of CAD $1,000–2,000 above the minimum to protect against naira/CAD exchange rate fluctuations during the 6-month processing period."
      }
    },
    {
      "@type": "Question",
      "name": "What does a Nigerian bank letter for Canada need to include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your Nigerian bank letter for Canada Express Entry must be on official bank letterhead, signed by a bank officer, and include: your full name as on your passport, account number and type, current balance in local currency AND converted to CAD, the 6-month average balance, date the account was opened, statement that the funds are unencumbered (free of debt), and the bank's full contact information including phone and email. A printout from internet banking is not accepted — it must be an official signed letter."
      }
    },
    {
      "@type": "Question",
      "name": "How long do Nigerians need to season funds for Canada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IRCC does not have a strict rule requiring funds to sit for exactly 6 months. What matters is that your 6-month average balance meets or exceeds the proof of funds threshold. If your current balance is CAD $15,263 but your 6-month average is only CAD $5,000, IRCC will see the gap and may suspect the funds are borrowed. Nigerian applicants should ideally maintain qualifying balances for at least 6 months before applying to avoid scrutiny."
      }
    },
    {
      "@type": "Question",
      "name": "Can Nigerians use a fixed deposit or investment account for Canada proof of funds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — IRCC accepts funds in savings accounts, current accounts, fixed deposits (term deposits), money market accounts, and investment portfolios. For fixed deposits, you need a letter from the bank confirming the maturity date, current value, and that the funds are accessible. Funds in stocks or mutual funds are acceptable but should be presented with a statement of current market value. Funds pledged as collateral for a loan are NOT acceptable — they are considered encumbered."
      }
    },
    {
      "@type": "Question",
      "name": "Who is exempt from Canada proof of funds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Three categories of Express Entry applicants are exempt from proof of funds: (1) Canadian Experience Class (CEC) applicants — exempt entirely regardless of family size, (2) Applicants with a valid job offer supported by a positive LMIA or LMIA-exempt offer letter, (3) Applicants who are currently working legally in Canada on a valid work permit. If you were invited under FSW but also qualify for CEC, check your ITA carefully — some Nigerians get invited under FSW when CEC would have made them exempt."
      }
    },
    {
      "@type": "Question",
      "name": "What exchange rate should Nigerians use to convert naira to CAD for proof of funds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the Bank of Canada daily exchange rate on the date you submit your PR application. Do NOT use the rate at the time you requested your bank letter — use the rate on submission day. Because the naira fluctuates significantly against CAD, maintain a buffer of at least CAD $2,000 above the minimum. If the naira weakens between your bank letter date and submission date, a smaller-than-expected buffer could push you below the threshold."
      }
    }
  ]
};

const fundsTable = [
  { size: 'Single applicant', cad: 'CAD $15,263', ngn: '~₦16.7 million', buffer: 'CAD $17,000+' },
  { size: '2 people (couple)', cad: 'CAD $19,007', ngn: '~₦20.8 million', buffer: 'CAD $21,000+' },
  { size: '3 people', cad: 'CAD $23,404', ngn: '~₦25.6 million', buffer: 'CAD $25,500+' },
  { size: '4 people', cad: 'CAD $28,362', ngn: '~₦31 million', buffer: 'CAD $30,500+' },
  { size: '5 people', cad: 'CAD $32,185', ngn: '~₦35.2 million', buffer: 'CAD $34,500+' },
  { size: '6 people', cad: 'CAD $36,270', ngn: '~₦39.7 million', buffer: 'CAD $38,500+' },
  { size: '7+ people', cad: 'CAD $40,357', ngn: '~₦44.2 million', buffer: 'CAD $43,000+' },
];

export default function CanadaProofOfFunds() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🇳🇬 → 🇨🇦</div>
            <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Updated June 2026 — 2026 IRCC LICO figures
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Canada Proof of Funds 2026: The Complete Guide for Nigerians
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Exact CAD amounts by family size, the precise bank letter format IRCC requires, the 6-month seasoning rule explained, and the Nigerian-specific red flags that cause refusals.
            </p>
          </div>

          {/* Alert banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <strong>Nigerian applicants face extra scrutiny.</strong> IRCC flags Nigerian applications more frequently for proof of funds issues than almost any other nationality. This guide covers the specific patterns that trigger refusals for Nigerians — read it before requesting your bank letter.
            </div>
          </div>

          {/* Exact amounts table */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-2">Exact Proof of Funds Amounts 2026</h2>
            <p className="text-gray-600 text-sm mb-6">
              Based on IRCC's Low Income Cut-Off (LICO) updated July 2025. These are the minimums — always maintain the recommended buffer column below due to naira/CAD exchange rate risk.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700">Family Size</th>
                    <th className="text-left p-3 font-semibold text-blue-700">Min. Required (CAD)</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Approx. Naira</th>
                    <th className="text-left p-3 font-semibold text-green-700">Recommended Buffer</th>
                  </tr>
                </thead>
                <tbody>
                  {fundsTable.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-800">{row.size}</td>
                      <td className="p-3 text-blue-700 font-bold">{row.cad}</td>
                      <td className="p-3 text-gray-600">{row.ngn}</td>
                      <td className="p-3 text-green-700 font-semibold">{row.buffer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Count ALL family members including spouse and children — even if they are not coming to Canada with you, and even if they are Canadian citizens already. Naira figures calculated at approximately ₦1,095/CAD. Exchange rates fluctuate — recalculate on submission day using the Bank of Canada rate.
            </p>
          </div>

          {/* Who is exempt */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-green-900 mb-3 text-lg">Who Does NOT Need Proof of Funds?</h3>
            <div className="space-y-3">
              {[
                { title: 'Canadian Experience Class (CEC) applicants', desc: 'Completely exempt from proof of funds — regardless of family size. If you are already working in Canada, apply under CEC.' },
                { title: 'Applicants with a valid LMIA-backed job offer', desc: 'A job offer supported by a positive Labour Market Impact Assessment removes the proof of funds requirement entirely.' },
                { title: 'Applicants currently working in Canada legally', desc: 'If you hold a valid Canadian work permit and are employed, you may be exempt even under FSW. Confirm this with your ITA letter.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-green-900 text-sm">{item.title}</div>
                    <div className="text-green-800 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What IRCC accepts */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">What Counts as Proof of Funds — and What Doesn't</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> IRCC Accepts</h3>
                <div className="space-y-2">
                  {[
                    'Savings accounts (current and domiciliary)',
                    'Fixed deposits / term deposits with maturity date',
                    'Money market accounts',
                    'Investment portfolios (stocks, mutual funds)',
                    'Foreign currency accounts (USD, GBP, EUR)',
                    'Funds held in multiple accounts — combined',
                    'Joint accounts (if you have full access)',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2"><XCircle className="w-5 h-5" /> IRCC Does NOT Accept</h3>
                <div className="space-y-2">
                  {[
                    'Borrowed funds or loans taken to meet the threshold',
                    'Funds pledged as collateral for any debt',
                    'Property equity or real estate value',
                    'Funds held by family members on your behalf',
                    'Internet banking screenshots (unverified)',
                    'Business accounts you do not own outright',
                    'Gift funds without a clear gift letter and donor proof',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bank letter format */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-4">The Exact Bank Letter Format IRCC Requires</h2>
            <p className="text-gray-600 text-sm mb-6">
              A bank statement printout is not enough. IRCC requires an official signed bank letter. When you go to your Nigerian bank (GTBank, Zenith, Access, First Bank, UBA, etc.), request a "bank reference letter for immigration purposes" and confirm it contains all of the following:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="font-mono text-sm space-y-2 text-gray-700">
                <div className="font-bold text-gray-900 mb-4">Your bank letter must include:</div>
                {[
                  '✅ Bank official letterhead with logo',
                  '✅ Bank officer full name, title, signature and date',
                  '✅ Bank full address, phone number, and email',
                  '✅ Your full name exactly as on your passport',
                  '✅ Your account number(s) and account type(s)',
                  '✅ Account opening date',
                  '✅ Current balance in Nigerian Naira',
                  '✅ 6-month average balance',
                  '✅ Statement that funds are unencumbered (no liens or debts against them)',
                  '✅ Outstanding loans or credit facilities listed (even if zero)',
                  '✅ CAD equivalent at current Bank of Canada rate (some banks include this — if not, calculate it yourself and attach)',
                ].map((item, i) => (
                  <div key={i}>{item}</div>
                ))}
              </div>
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Nigerian bank tip:</strong> Banks like GTBank, Zenith, and Access are well-known to IRCC and generally issue acceptable letters. However, some Nigerian bank officers issue letters missing the 6-month average balance — the single most common reason Nigerian applicants get flagged. Before leaving the bank, check that the 6-month average is explicitly stated in the letter.
              </p>
            </div>
          </div>

          {/* Nigerian-specific red flags */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">Nigerian-Specific Red Flags That Trigger IRCC Review</h2>
            <div className="space-y-4">
              {[
                {
                  flag: 'Large deposit 1–3 months before application',
                  detail: 'If your current balance is ₦16 million but your 6-month average is ₦3 million, IRCC sees a sudden jump. This is the most common pattern in Nigerian applications. IRCC will either request an explanation or refuse outright. Solution: Build your balance gradually over 6+ months.',
                  severity: 'Critical',
                },
                {
                  flag: 'Multiple accounts with small balances that "add up"',
                  detail: 'Having 5 accounts with ₦3 million each to total ₦15 million is fine in principle, but each account must have its own bank letter. If any account was recently opened or funded, IRCC will query it. Consolidating into 1-2 accounts is cleaner.',
                  severity: 'High',
                },
                {
                  flag: 'Domiciliary USD account with unexplained inflows',
                  detail: 'Nigerian applicants often hold USD in domiciliary accounts. IRCC accepts this but will scrutinise the source of USD funds. Be prepared to explain where the foreign currency came from — salary, remittances, business proceeds.',
                  severity: 'Medium',
                },
                {
                  flag: 'Bank letter not signed by an officer or undated',
                  detail: 'Some Nigerian banks issue computer-generated letters without a visible signature or stamp. IRCC requires a human signature. If your letter only has a stamp, return to the bank and request a version with an officer\'s name, signature, and date.',
                  severity: 'High',
                },
                {
                  flag: 'Fixed deposit maturing after your intended landing date',
                  detail: 'If your fixed deposit matures in 2027 but you plan to land in Canada in late 2026, IRCC may question whether the funds are truly accessible. Use funds that are either already liquid or maturing well before your landing window.',
                  severity: 'Medium',
                },
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      {item.flag}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                      item.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      item.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{item.severity}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step by step build plan */}
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold mb-6">12-Month Proof of Funds Build Plan for Nigerians</h2>
            <p className="text-gray-600 text-sm mb-6">
              If you are starting from zero or have insufficient funds today, here is a realistic plan to hit the threshold by month 12:
            </p>
            <div className="space-y-4">
              {[
                { month: 'Month 1–2', action: 'Open a dedicated savings account', detail: 'Do not mix this account with daily spending. Open a high-yield savings or domiciliary USD account. Make your first deposit — even ₦500,000 starts the seasoning clock.' },
                { month: 'Month 3–4', action: 'Build consistently — add monthly', detail: 'Add a fixed amount each month. Consistent deposits over time look infinitely better than a lump sum later. Document the source of every deposit: salary, freelance invoice, rental income.' },
                { month: 'Month 5–6', action: 'Reach 50% of your threshold', detail: 'By month 6 you should have roughly half the required amount. This gives your 6-month average a strong baseline. Avoid withdrawals from this account.' },
                { month: 'Month 7–9', action: 'Hit your full threshold with buffer', detail: 'Reach CAD $17,000+ equivalent (for a single applicant). At this point your 6-month average is climbing toward the minimum. Keep the balance stable.' },
                { month: 'Month 10–11', action: 'Request your bank letter', detail: 'Request the official signed bank reference letter. Check it includes the 6-month average balance. Start your Express Entry profile if not already done.' },
                { month: 'Month 12', action: 'Submit your PR application', detail: 'Your 6-month average should now meet or exceed the threshold. Convert to CAD using the Bank of Canada rate on submission day. You are ready.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">{item.month}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.action}</div>
                    <div className="text-gray-600 text-sm mt-1">{item.detail}</div>
                  </div>
                </div>
              ))}
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
            <h2 className="text-2xl font-bold mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { href: '/visa-guide/nigeria-to-canada', label: '🇨🇦 Nigeria to Canada Full Guide 2026', desc: 'Express Entry, CRS scores, full cost breakdown' },
                { href: '/comparisons/canada-vs-australia-nigerians', label: '🇨🇦 vs 🇦🇺 Canada vs Australia 2026', desc: 'Which country is better for your profile?' },
                { href: '/visa-guide/nigeria-to-uk', label: '🇬🇧 Nigeria to UK Proof of Funds', desc: 'UK requires £2,530 for 28 days — different rules' },
                { href: '/visa-guide/nigeria-to-germany', label: '🇩🇪 Germany Proof of Funds', desc: '€12,000+ for Opportunity Card job search period' },
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
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Canada Application?</h2>
            <p className="mb-2 opacity-90 max-w-xl mx-auto">
              Japa Genie will check your full profile — IELTS score, degree, work experience, and finances — and tell you your likely CRS score, which Canada pathway you qualify for, and exactly what to do next.
            </p>
            <p className="text-sm opacity-75 mb-6">Free eligibility check. No agent fees.</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
              <a href="/kyc" className="flex items-center gap-2">
                Check My Canada Eligibility Free <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

        </div>
      </section>
    </>
  );
}
