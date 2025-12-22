// src/lib/currency-live.ts
import { AFRICAN_CURRENCIES, CurrencyInfo } from './african-currencies';

const API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'demo';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

let cachedRates: Record<string, number> | null = null;
let lastFetch = 0;
const CACHE_MS = 3_600_000; // 1 hr

export async function getCurrencyInfoWithLiveRate(userCountry?: string): Promise<CurrencyInfo> {
  const base = AFRICAN_CURRENCIES[userCountry?.toLowerCase() || ''];
  if (!base || base.code === 'USD') return base;

  const now = Date.now();
  if (!cachedRates || (now - lastFetch) > CACHE_MS) {
    try {
      const res = await fetch(API_URL, { next: { revalidate: 3600 } });
      const data = await res.json();
      if (data.result === 'success') {
        cachedRates = data.conversion_rates;
        lastFetch = now;
      }
    } catch {
      // silent fallback
    }
  }
  const liveRate = cachedRates?.[base.code] ?? base.rate;
  return { ...base, rate: liveRate, lastUpdated: new Date().toISOString().split('T')[0] };
}
