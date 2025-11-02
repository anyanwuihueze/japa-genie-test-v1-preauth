import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
async function fetcher(days = 7) {
const { data, error } = await supabase
.from('visa_pulse')
.select('*')
.gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
.order('created_at', { ascending: false })
.limit(50);
if (error) throw error;
return data;
}
export default function useVisaPulse(days = 7) {
const { data, error, isLoading } = useSWR(['visa-pulse', days], () => fetcher(days), {
refreshInterval: 60_000,
});
return { pulse: data || [], isLoading, error };
}
