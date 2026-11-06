'use client';

import { useState } from 'react';

export default function TrainingDemoPage() {
  const [question, setQuestion] = useState(
    'I am a Nigerian professional exploring skilled migration. Where should I start?'
  );

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-900">
      <section className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Japa Genie · Training Sandbox
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Your Visa Journey Starts Here
        </h1>

        <p className="mt-3 text-slate-600">
          Explore your options with a clear plan. No scams. No fluff. No guesswork.
        </p>

        <label
          htmlFor="visa-question"
          className="mt-8 block font-semibold"
        >
          Your question
        </label>

        <textarea
          id="visa-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="mt-2 min-h-28 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-emerald-600"
        />

        <div className="mt-5 rounded-xl bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-900">
            Your next step
          </p>
          <p className="mt-2 leading-7 text-slate-700">
            Start by checking your eligibility, occupation, budget, and destination
            requirements before spending money on an application.
          </p>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          TRAINING DEMO ONLY · Sample guidance, not an AI-generated assessment.
        </p>
      </section>
    </main>
  );
}
