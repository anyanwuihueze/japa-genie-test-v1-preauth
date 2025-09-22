import Link from 'next/link';

export default function WhereYoureStuck() {
  const painPoints = [
    {
      title: "Your visa got denied",
      description: "You got the rejection letter and now you're panicking. Let's turn this around together.",
      emoji: "💔",
      cta: "Show me how to recover from rejection",
      path: "/rejection-reversal",
    },
    {
      title: "You're overwhelmed by documents",
      description: "Proof of funds, flight bookings, hotel confirmations... I'll help you get REAL ones that won't get flagged.",
      emoji: "📑",
      cta: "Help me sort my documents",
      path: "/document-help",
    },
    {
      title: "You're applying for asylum",
      description: "This is heavy. You need someone who won't judge, just help. I've guided others through this.",
      emoji: "🕊️",
      cta: "Guide me through asylum",
      path: "/asylum-help",
    },
    {
      title: "You're prepping for your interview",
      description: "Nervous? Good. Let's practice until you walk in feeling like you own the room.",
      emoji: "🎤",
      cta: "Prep me for my interview",
      path: "/interview-prep",
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            So... where are you stuck right now?
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pick what feels closest to your situation. I’ve been there too — 
            let me show you how I got through it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {painPoints.map((point, index) => (
            <Link 
              key={index} 
              href={point.path}
              className="group rounded-xl p-6 transition-all duration-300 hover:shadow-md border border-gray-100 bg-white"
            >
              <div className="flex items-start space-x-4">
                <span className="text-3xl mt-1 group-hover:scale-110 transition-transform">{point.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600">{point.title}</h2>
                  <p className="text-gray-600 mb-4">{point.description}</p>
                  <p className="font-medium text-blue-600 group-hover:text-blue-700">
                    {point.cta} →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
