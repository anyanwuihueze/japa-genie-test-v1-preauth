import { getCurrencyInfo } from './african-currencies';

export function formatCostDisplay(usdAmount: number, userCountry?: string): string {
  const currency = getCurrencyInfo(userCountry);
  
  // If no country or already USD, show only USD (no redundancy)
  if (!userCountry || currency.code === 'USD') {
    return `$${usdAmount} USD`;
  }
  
  // Convert to local currency and format with commas
  const localAmount = Math.round(usdAmount * currency.rate);
  const formattedLocal = localAmount.toLocaleString();
  return `$${usdAmount} USD (${currency.symbol}${formattedLocal})`;
}
