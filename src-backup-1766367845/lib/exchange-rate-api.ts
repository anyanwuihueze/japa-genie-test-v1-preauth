/**
 * Exchange Rate API Integration
 * Provider: ExchangeRate-API.com (1,500 free requests/month)
 * Updates: Hourly
 * Fallback: Uses cached rates from african-currencies.ts
 */

import { AFRICAN_CURRENCIES, CurrencyInfo } from './african-currencies';

const API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'demo'; // Add your API key to .env
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

interface ExchangeRateResponse {
  result: string;
  time_last_update_unix: number;
  conversion_rates: Record<string, number>;
}

let cachedRates: Record<string, number> | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Fetch live exchange rates from API
 * Falls back to cached rates if API fails
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  
  // Return cached rates if still fresh (within 1 hour)
  if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour in Next.js
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();

    if (data.result === 'success') {
      cachedRates = data.conversion_rates;
      lastFetchTime = now;
      console.log('✅ Exchange rates updated from API');
      return cachedRates;
    }

    throw new Error('API returned unsuccessful result');

  } catch (error) {
    console.warn('⚠️ Exchange rate API failed, using fallback rates:', error);
    
    // Fallback to hardcoded rates from african-currencies.ts
    const fallbackRates: Record<string, number> = {};
    Object.values(AFRICAN_CURRENCIES).forEach(currency => {
      fallbackRates[currency.code] = currency.rate;
    });
    
    return fallbackRates;
  }
}

/**
 * Get current rate for a specific currency code
 */
export async function getRate(currencyCode: string): Promise<number> {
  const rates = await fetchExchangeRates();
  return rates[currencyCode] || 1; // Default to 1 if not found (USD)
}

/**
 * Update CurrencyInfo with live rate
 */
export async function getCurrencyInfoWithLiveRate(userInput?: string): Promise<CurrencyInfo> {
  const { getCurrencyInfo } = await import('./african-currencies');
  const baseCurrency = getCurrencyInfo(userInput);
  
  // If it's USD, no need to fetch rate
  if (baseCurrency.code === 'USD') {
    return baseCurrency;
  }

  try {
    const liveRate = await getRate(baseCurrency.code);
    
    return {
      ...baseCurrency,
      rate: liveRate,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.warn(`Using fallback rate for ${baseCurrency.code}`);
    return baseCurrency; // Return original if live fetch fails
  }
}
