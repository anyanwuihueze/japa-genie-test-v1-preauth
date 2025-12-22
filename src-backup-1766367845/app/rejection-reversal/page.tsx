import RejectionReversalClient from './client';

export default function RejectionReversalPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent">
          Don't Let a "No" Be the Final Answer
        </h1>
        <p className="text-lg text-muted-foreground">
          A visa rejection feels like the end of the road, but it's often a solvable puzzle. Our AI analyzes why you were rejected and creates a new strategy to turn your next application into a success.
        </p>
      </header>
      <RejectionReversalClient />
    </div>
  );
}
