/**
 * Complete database of all 54 African countries and their currencies
 * Last updated: 2025-01-25
 * Sources: African central banks, xe.com, oanda.com
 * 
 * NOTE: Exchange rates are approximate. For exact rates, use the exchange rate API.
 * Update these rates monthly or use the auto-update feature.
 */

export interface CurrencyInfo {
  country: string;
  code: string;
  symbol: string;
  rate: number; // Approximate rate to 1 USD
  lastUpdated: string;
  region: 'North' | 'West' | 'East' | 'Central' | 'Southern';
  notes?: string;
}

export const AFRICAN_CURRENCIES: Record<string, CurrencyInfo> = {
  // NORTH AFRICA (6 countries)
  algeria: {
    country: 'Algeria',
    code: 'DZD',
    symbol: 'DA ',
    rate: 135,
    lastUpdated: '2025-01-25',
    region: 'North',
  },
  egypt: {
    country: 'Egypt',
    code: 'EGP',
    symbol: 'E£',
    rate: 49,
    lastUpdated: '2025-01-25',
    region: 'North',
  },
  libya: {
    country: 'Libya',
    code: 'LYD',
    symbol: 'LD ',
    rate: 4.8,
    lastUpdated: '2025-01-25',
    region: 'North',
    notes: 'Second strongest African currency',
  },
  morocco: {
    country: 'Morocco',
    code: 'MAD',
    symbol: 'DH ',
    rate: 10,
    lastUpdated: '2025-01-25',
    region: 'North',
  },
  sudan: {
    country: 'Sudan',
    code: 'SDG',
    symbol: 'SDG ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'North',
  },
  tunisia: {
    country: 'Tunisia',
    code: 'TND',
    symbol: 'DT ',
    rate: 3.1,
    lastUpdated: '2025-01-25',
    region: 'North',
    notes: 'Strongest African currency',
  },

  // WEST AFRICA (17 countries)
  benin: {
    country: 'Benin',
    code: 'XOF',
    symbol: 'CFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'West African CFA Franc',
  },
  burkinafaso: {
    country: 'Burkina Faso',
    code: 'XOF',
    symbol: 'CFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'West African CFA Franc',
  },
  caboverde: {
    country: 'Cabo Verde',
    code: 'CVE',
    symbol: 'CVE ',
    rate: 100,
    lastUpdated: '2025-01-25',
    region: 'West',
  },
  cotedivoire: {
    country: "Côte d'Ivoire",
    code: 'XOF',
    symbol: 'CFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'West African CFA Franc',
  },
  gambia: {
    country: 'Gambia',
    code: 'GMD',
    symbol: 'D ',
    rate: 65,
    lastUpdated: '2025-01-25',
    region: 'West',
  },
  ghana: {
    country: 'Ghana',
    code: 'GHS',
    symbol: 'GH₵',
    rate: 12,
    lastUpdated: '2025-01-25',
    region: 'West',
  },
  guinea: {
    country: 'Guinea',
    code: 'GNF',
    symbol: 'FG ',
    rate: 8600,
    lastUpdated: '2025-01-25',
    region: 'West',
  },
  guineabissau: {
    country: 'Guinea-Bissau',
    code: 'XOF',
    symbol: 'CFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'West African CFA Franc',
  },
  liberia: {
    country: 'Liberia',
    code: 'LRD',
    symbol: 'L$ ',
    rate: 190,
    lastUpdated: '2025-01-25',
    region: 'West',
  },
  mali: {
    country: 'Mali',
    code: 'XOF',
    symbol: 'CFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'West African CFA Franc',
  },
  mauritania: {
    country: 'Mauritania',
    code: 'MRU',
    symbol: 'UM ',
    rate: 36,
    lastUpdated: '2025-01-25',
    region: 'West',
  },
  niger: {
    country: 'Niger',
    code: 'XOF',
    symbol: 'CFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'West African CFA Franc',
  },
  nigeria: {
    country: 'Nigeria',
    code: 'NGN',
    symbol: '₦',
    rate: 1650,
    lastUpdated: '2025-01-25',
    region: 'West',
  },
  senegal: {
    country: 'Senegal',
    code: 'XOF',
    symbol: 'CFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'West African CFA Franc',
  },
  sierraleone: {
    country: 'Sierra Leone',
    code: 'SLL',
    symbol: 'Le ',
    rate: 22000,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'Weakest African currency',
  },
  togo: {
    country: 'Togo',
    code: 'XOF',
    symbol: 'CFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'West',
    notes: 'West African CFA Franc',
  },

  // EAST AFRICA (13 countries)
  burundi: {
    country: 'Burundi',
    code: 'BIF',
    symbol: 'FBu ',
    rate: 2850,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  comoros: {
    country: 'Comoros',
    code: 'KMF',
    symbol: 'CF ',
    rate: 450,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  djibouti: {
    country: 'Djibouti',
    code: 'DJF',
    symbol: 'Fdj ',
    rate: 177,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  eritrea: {
    country: 'Eritrea',
    code: 'ERN',
    symbol: 'Nfk ',
    rate: 15,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  ethiopia: {
    country: 'Ethiopia',
    code: 'ETB',
    symbol: 'Br ',
    rate: 125,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  kenya: {
    country: 'Kenya',
    code: 'KES',
    symbol: 'KSh ',
    rate: 130,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  madagascar: {
    country: 'Madagascar',
    code: 'MGA',
    symbol: 'Ar ',
    rate: 4500,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  mauritius: {
    country: 'Mauritius',
    code: 'MUR',
    symbol: 'Rs ',
    rate: 46,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  rwanda: {
    country: 'Rwanda',
    code: 'RWF',
    symbol: 'FRw ',
    rate: 1300,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  seychelles: {
    country: 'Seychelles',
    code: 'SCR',
    symbol: 'SR ',
    rate: 13,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  somalia: {
    country: 'Somalia',
    code: 'SOS',
    symbol: 'Sh ',
    rate: 570,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  southsudan: {
    country: 'South Sudan',
    code: 'SSP',
    symbol: 'SS£ ',
    rate: 1300,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  tanzania: {
    country: 'Tanzania',
    code: 'TZS',
    symbol: 'TSh ',
    rate: 2500,
    lastUpdated: '2025-01-25',
    region: 'East',
  },
  uganda: {
    country: 'Uganda',
    code: 'UGX',
    symbol: 'USh ',
    rate: 3700,
    lastUpdated: '2025-01-25',
    region: 'East',
  },

  // CENTRAL AFRICA (9 countries)
  angola: {
    country: 'Angola',
    code: 'AOA',
    symbol: 'Kz ',
    rate: 850,
    lastUpdated: '2025-01-25',
    region: 'Central',
  },
  cameroon: {
    country: 'Cameroon',
    code: 'XAF',
    symbol: 'FCFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'Central',
    notes: 'Central African CFA Franc',
  },
  centralafricanrepublic: {
    country: 'Central African Republic',
    code: 'XAF',
    symbol: 'FCFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'Central',
    notes: 'Central African CFA Franc',
  },
  chad: {
    country: 'Chad',
    code: 'XAF',
    symbol: 'FCFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'Central',
    notes: 'Central African CFA Franc',
  },
  drcongo: {
    country: 'Democratic Republic of Congo',
    code: 'CDF',
    symbol: 'FC ',
    rate: 2800,
    lastUpdated: '2025-01-25',
    region: 'Central',
  },
  equatorialguinea: {
    country: 'Equatorial Guinea',
    code: 'XAF',
    symbol: 'FCFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'Central',
    notes: 'Central African CFA Franc',
  },
  gabon: {
    country: 'Gabon',
    code: 'XAF',
    symbol: 'FCFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'Central',
    notes: 'Central African CFA Franc',
  },
  congo: {
    country: 'Republic of Congo',
    code: 'XAF',
    symbol: 'FCFA ',
    rate: 600,
    lastUpdated: '2025-01-25',
    region: 'Central',
    notes: 'Central African CFA Franc',
  },
  saotome: {
    country: 'São Tomé and Príncipe',
    code: 'STN',
    symbol: 'Db ',
    rate: 22,
    lastUpdated: '2025-01-25',
    region: 'Central',
  },

  // SOUTHERN AFRICA (9 countries)
  botswana: {
    country: 'Botswana',
    code: 'BWP',
    symbol: 'P',
    rate: 13,
    lastUpdated: '2025-01-25',
    region: 'Southern',
  },
  eswatini: {
    country: 'Eswatini',
    code: 'SZL',
    symbol: 'E ',
    rate: 18,
    lastUpdated: '2025-01-25',
    region: 'Southern',
    notes: 'Formerly Swaziland, pegged to South African Rand',
  },
  lesotho: {
    country: 'Lesotho',
    code: 'LSL',
    symbol: 'L ',
    rate: 18,
    lastUpdated: '2025-01-25',
    region: 'Southern',
    notes: 'Pegged to South African Rand',
  },
  malawi: {
    country: 'Malawi',
    code: 'MWK',
    symbol: 'MK ',
    rate: 1750,
    lastUpdated: '2025-01-25',
    region: 'Southern',
  },
  mozambique: {
    country: 'Mozambique',
    code: 'MZN',
    symbol: 'MT ',
    rate: 64,
    lastUpdated: '2025-01-25',
    region: 'Southern',
  },
  namibia: {
    country: 'Namibia',
    code: 'NAD',
    symbol: 'N$ ',
    rate: 18,
    lastUpdated: '2025-01-25',
    region: 'Southern',
    notes: 'Pegged to South African Rand',
  },
  southafrica: {
    country: 'South Africa',
    code: 'ZAR',
    symbol: 'R',
    rate: 18,
    lastUpdated: '2025-01-25',
    region: 'Southern',
  },
  zambia: {
    country: 'Zambia',
    code: 'ZMW',
    symbol: 'ZK ',
    rate: 27,
    lastUpdated: '2025-01-25',
    region: 'Southern',
  },
  zimbabwe: {
    country: 'Zimbabwe',
    code: 'ZWL',
    symbol: 'Z$ ',
    rate: 320,
    lastUpdated: '2025-01-25',
    region: 'Southern',
    notes: 'Highly volatile due to hyperinflation history',
  },
};

/**
 * Fuzzy matching for user input
 * Handles variations like "Lagos, Nigeria" or "Nairobi, Kenya"
 */
export function getCurrencyInfo(userInput?: string): CurrencyInfo {
  // Default to USD for non-African or unrecognized input
  const defaultCurrency: CurrencyInfo = {
    country: 'International',
    code: 'USD',
    symbol: '$',
    rate: 1,
    lastUpdated: '2025-01-25',
    region: 'Southern', // Dummy region for type safety
  };

  if (!userInput) return defaultCurrency;

  const input = userInput.toLowerCase().trim();

  // Direct key match
  if (AFRICAN_CURRENCIES[input]) {
    return AFRICAN_CURRENCIES[input];
  }

  // Fuzzy match - check if country name appears in input
  for (const [key, currency] of Object.entries(AFRICAN_CURRENCIES)) {
    const countryLower = currency.country.toLowerCase();
    if (input.includes(key) || input.includes(countryLower)) {
      return currency;
    }
  }

  // Special cases for common variations
  const specialCases: Record<string, string> = {
    'ivory coast': 'cotedivoire',
    'cape verde': 'caboverde',
    'drc': 'drcongo',
    'dr congo': 'drcongo',
    'congo-brazzaville': 'congo',
    'congo-kinshasa': 'drcongo',
    'swaziland': 'eswatini',
    'lagos': 'nigeria',
    'accra': 'ghana',
    'nairobi': 'kenya',
    'johannesburg': 'southafrica',
    'cairo': 'egypt',
    'addis ababa': 'ethiopia',
    'dar es salaam': 'tanzania',
    'kampala': 'uganda',
    'kigali': 'rwanda',
  };

  for (const [variation, key] of Object.entries(specialCases)) {
    if (input.includes(variation) && AFRICAN_CURRENCIES[key]) {
      return AFRICAN_CURRENCIES[key];
    }
  }

  return defaultCurrency;
}

/**
 * Get all currencies by region
 */
export function getCurrenciesByRegion(region: CurrencyInfo['region']): CurrencyInfo[] {
  return Object.values(AFRICAN_CURRENCIES).filter(c => c.region === region);
}

/**
 * Get CFA Franc countries (shared currency zones)
 */
export function getCFAFrancCountries(): { west: CurrencyInfo[]; central: CurrencyInfo[] } {
  const west = Object.values(AFRICAN_CURRENCIES).filter(c => c.code === 'XOF');
  const central = Object.values(AFRICAN_CURRENCIES).filter(c => c.code === 'XAF');
  return { west, central };
}
