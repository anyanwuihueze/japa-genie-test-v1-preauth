import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/client';
export const runtime = 'edge';
const todayRows = [
{ category:'approval', headline:'80 Ghanaian applicants approved – strong proof of funds', count:80, country_code:'GH' },
{ category:'refusal',  headline:'9 Nigerian refusals – poor documentation',            count:9,  country_code:'NG' },
{ category:'tip',      headline:'Kenya: new 6-month bank-statement rule now enforced', count:null, country_code:'KE' },
];
export async function GET(req: NextRequest) {
if (req.headers.get('Authorization') !== Bearer `${process.env.CRON_SECRET}`) {
return new Response('Unauthorized', { status: 401 });
}
const supabase = createClient();
const { error } = await supabase.from('visa_pulse').insert(
todayRows.map(r => ({ ...r, created_at: new Date().toISOString().slice(0,10) }))
);
return new Response(JSON.stringify({ ok: !error }), { status: error ? 500 : 200 });
}
