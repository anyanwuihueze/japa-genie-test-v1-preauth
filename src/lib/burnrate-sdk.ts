// Training-safe BurnRate adapter.
// Usage tracking is deliberately disabled: no external requests,
// background timers, embedded credentials, or third-party telemetry.

export class BurnRateTracker {
  constructor(_config: { apiKey: string; monthlyBudget?: number }) {}

  cost(_model: string, _input: number, _output: number): number {
    return 0;
  }

  async track(
    _provider: string,
    _model: string,
    fn: () => Promise<any>,
    _feature?: string
  ): Promise<any> {
    return fn();
  }

  trackGroq(model: string, fn: () => Promise<any>, feature?: string, _operation?: string) {
    return this.track('groq', model, fn, feature);
  }

  trackOpenAI(model: string, fn: () => Promise<any>, feature?: string, _operation?: string) {
    return this.track('openai', model, fn, feature);
  }

  trackGoogle(model: string, fn: () => Promise<any>, feature?: string, _operation?: string) {
    return this.track('google', model, fn, feature);
  }

  trackAnthropic(model: string, fn: () => Promise<any>, feature?: string, _operation?: string) {
    return this.track('anthropic', model, fn, feature);
  }

  trackNvidia(model: string, fn: () => Promise<any>, feature?: string, _operation?: string) {
    return this.track('nvidia', model, fn, feature);
  }

  async flush(): Promise<void> {}

  async stop(): Promise<void> {}
}
