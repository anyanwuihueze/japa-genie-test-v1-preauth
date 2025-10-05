import Link from 'next/link';

export default function WhereYoureStuck() {
  const painPoints = [
    {
      title: "Your visa got denied",
      description: "AI analyzes your rejection letter in 90 seconds to identify the exact reasons. For complex appeals, connect with immigration lawyers who specialize in reversals.",
      emoji: "💔",
      cta: "Analyze my rejection",
      path: "/rejection-reversal",
    },
    {
      title: "You're overwhelmed by documents",
      description: "AI scans your documents for common red flags and missing items. Upgrade to document verification with immigration specialists if needed.",
      emoji: "📑",
      cta: "Check my documents",
      path: "/document-check",
    },
    {
      title: "You're applying for asylum",
      description: "Get AI guidance on asylum documentation requirements. For sensitive cases, we'll connect you with humanitarian immigration lawyers.",
      emoji: "🕊️",
      cta: "Start asylum guidance",
      path: "/asylum-help",
    },
    {
      title: "You're prepping for your interview",
      description: "AI mock interview with instant feedback on your answers. Book a live practice session with former visa officers if you need more confidence.",
      emoji: "🎤",
      cta: "Practice my interview",
      path: "/interview",
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-purple-700 bg-clip-text text-transparent">
            Where Are You Stuck?
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Start with AI analysis, escalate to human experts when needed. Pick your situation below.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 bg-white/80 px-6 py-3 rounded-full border border-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">AI-First Approach</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Expert Backup Available</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {painPoints.map((point, index) => (
            <Link 
              key={index} 
              href={point.path}
              className="group relative bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100 hover:border-blue-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              
              <div className="flex items-start space-x-6">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {point.emoji}
                </span>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-700 transition-colors">
                    {point.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {point.description}
                  </p>
                  <p className="font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-2 transition-colors">
                    {point.cta}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">AI Speed + Human Expertise</h3>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            Every issue starts with instant AI analysis. Complex cases get matched with immigration specialists who understand African applicant challenges.
          </p>
          <div className="flex justify-center gap-8 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Instant AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Expert Escalation Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>2,800+ Cases Handled</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
