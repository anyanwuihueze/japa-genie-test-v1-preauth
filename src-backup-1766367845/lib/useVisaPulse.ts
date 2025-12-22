import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';

// FALLBACK DATA - Always shows if Supabase fails or has no recent data
const FALLBACK_PULSE_DATA = [
  { 
    id: 'fallback-1', 
    category: 'approval', 
    headline: '20 EU countries launch emergency skilled worker programs',
    count: null,
    country_code: 'EU',
    created_at: new Date().toISOString()
  },
  { 
    id: 'fallback-2', 
    category: 'tip', 
    headline: 'Germany needs 400,000 skilled workers - Africans eligible',
    count: 400000,
    country_code: 'DE',
    created_at: new Date().toISOString()
  },
  { 
    id: 'fallback-3', 
    category: 'refusal', 
    headline: 'Nigeria bandit crisis displaces 200,000 - migration surge to Europe',
    count: 200000,
    country_code: 'NG',
    created_at: new Date().toISOString()
  },
  { 
    id: 'fallback-4', 
    category: 'tip', 
    headline: 'Canadian Express Entry scores dropping - apply NOW',
    count: null,
    country_code: 'CA',
    created_at: new Date().toISOString()
  },
  { 
    id: 'fallback-5', 
    category: 'approval', 
    headline: 'Seychelles tops Africa visa openness - 22 countries visa-free',
    count: 22,
    country_code: 'SC',
    created_at: new Date().toISOString()
  },
  { 
    id: 'fallback-6', 
    category: 'tip', 
    headline: '12,000+ truck driver jobs in Europe for Africans',
    count: 12000,
    country_code: 'EU',
    created_at: new Date().toISOString()
  },
  { 
    id: 'fallback-7', 
    category: 'approval', 
    headline: 'South Africa clears decade-old visa backlog by Christmas',
    count: null,
    country_code: 'ZA',
    created_at: new Date().toISOString()
  },
];

async function fetcher(days = 30) {
  const supabase = createClient();
  
  // Calculate date threshold (DATE only, not timestamp)
  const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]; // Get just YYYY-MM-DD
  
  console.log('🔍 Fetching visa pulse data...', { days, dateThreshold });
  
  try {
    const { data, error } = await supabase
      .from('visa_pulse')
      .select('*')
      .gte('created_at', dateThreshold)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('❌ Supabase fetch error:', error);
      console.warn('⚠️ Using fallback data instead');
      return FALLBACK_PULSE_DATA;
    }
    
    // If we got data from Supabase, use it
    if (data && data.length > 0) {
      console.log('✅ Fetched from Supabase:', data.length, 'items');
      return data;
    }
    
    // If Supabase returned no data, use fallback
    console.warn('⚠️ No recent data in Supabase, using fallback data');
    return FALLBACK_PULSE_DATA;
    
  } catch (err) {
    console.error('❌ Fetch exception:', err);
    console.warn('⚠️ Using fallback data due to exception');
    return FALLBACK_PULSE_DATA;
  }
}

export default function useVisaPulse(days = 30) {
  const { data, error, isLoading } = useSWR(
    ['visa-pulse', days], 
    () => fetcher(days), 
    {
      refreshInterval: 300_000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      fallbackData: FALLBACK_PULSE_DATA, // Show this immediately while loading
      dedupingInterval: 60_000, // Prevent duplicate requests within 1 min
    }
  );

  return { 
    pulse: data || FALLBACK_PULSE_DATA, // ALWAYS return something
    isLoading, 
    error 
  };
}