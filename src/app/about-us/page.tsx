import { Button } from '@/components/ui/button';

export default function AboutUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Why Japa Genie Exists
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built by Africans, for Africans — because we've seen too many lose everything to fake promises.
          </p>
        </div>

        {/* The Real Problem Section */}
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">The Problem We Saw</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProblemCard 
              title="Bleeding Money"
              description="N150,000+ paid to 'agents' who disappear after taking payment"
              icon="💸"
            />
            <ProblemCard 
              title="Inadequate Information"
              description="'Just apply online' — no guidance for African applicants"
              icon="❓"
            />
            <ProblemCard 
              title="Generic Western Advice"
              description="Tips that work for Europeans but get Africans rejected"
              icon="🌍"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 italic max-w-2xl mx-auto">
              We've seen friends lose life savings, miss deadlines, and get rejected because they couldn't access the right information.
            </p>
          </div>
        </div>

        {/* Our Solution Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold mb-4">How We Fixed It</h2>
            <p className="text-gray-600 mb-4">
              Our team spent 18 months:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Interviewing 100+ successful African immigrants</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Documenting real embassy requirements (not guesswork)</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Building verification for real experts (no more scams)</span>
              </li>
            </ul>
            <p className="text-gray-600">
              Japa Genie exists so you never have to waste money or time like we saw so many do.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Built for Us, by Us</h3>
                <p className="text-gray-600 mt-2">
                  Every feature was created after helping 100+ Africans get their visas.
                  No theory. Just what actually works.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How We're Different - ENHANCED */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How We're Different</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="No Fake Promises"
              description="We don't sell 'guaranteed visas' — just real help for real applications. If your embassy rejects you, we'll help you understand why."
              icon="🛡️"
            />
            <FeatureCard 
              title="Price-Conscious"
              description="We know money is tight. Pay only what makes sense for your journey — starting with 3 free wishes."
              icon="💰"
            />
            <FeatureCard 
              title="African-Centered"
              description="Visa advice that understands your context — from document requirements to interview questions that actually get asked in African embassies."
              icon="🌍"
            />
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90" asChild>
            <a href="/chat">
              Start Your Journey <span className="ml-2">✨</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
