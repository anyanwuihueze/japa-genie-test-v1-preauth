import axios from 'axios';

let cache: { rate: number; ts: number } | null = null;
const CACHE_MS = 24 * 60 * 60 * 1000; // 24 h

/* returns 1 EUR → USD cross-rate */
async function ecbUsdRate(): Promise<number> {
  if (cache && Date.now() - cache.ts < CACHE_MS) return cache.rate;
  const { data } = await axios.get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
  const m = data.match(/currency="USD" rate="([\d.]+)"/);
  const rate = m ? parseFloat(m[1]) : 1.08; // fallback
  cache = { rate, ts: Date.now() };
  return rate;
}

/* convert any ISO currency → USD */
export async function fxToUSD(currency = 'USD'): Promise<number> {
  if (currency === 'USD') return 1;
  const eurUsd = await ecbUsdRate();
  if (currency === 'EUR') return eurUsd;

  // add more crosses if needed (same XML contains all)
  const crosses: Record<string, number> = {
    GBP: 0.85,
    CAD: 1.47,
    NGN: 460,
    KES: 135,
    GHS: 12.2,
  };
  const cross = crosses[currency.toUpperCase()];
  if (cross) return eurUsd / cross;

  return eurUsd; // fallback
}
