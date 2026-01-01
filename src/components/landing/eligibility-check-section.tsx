'use client';

export function EligibilityCheckSection() {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Check Your Visa Eligibility
          </h2>
          <p className="text-lg text-gray-600">
            Get honest feedback on your visa chances in 3 minutes
          </p>
          <a 
            href="/interview" 
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Eligibility Check
          </a>
        </div>
      </div>
    </section>
  );
}
