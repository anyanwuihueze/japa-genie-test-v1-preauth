import * as functions from 'firebase-functions';
import { createClient } from '@supabase/supabase-js';

const todayRows = [
  { category:'approval', headline:'80 Ghanaian applicants approved – strong proof of funds', count:80, country_code:'GH' },
  { category:'refusal',  headline:'9 Nigerian refusals – poor documentation',            count:9,  country_code:'NG' },
  { category:'tip',      headline:'Kenya: new 6-month bank-statement rule now enforced', count:null, country_code:'KE' },
];

export const visaPulse = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  const config = functions.config();
  const supabase = createClient(
    config.supabase.url,
    config.supabase.key
  );
  
  if (req.headers.authorization !== `Bearer ${config.cron.secret}`) {
    res.status(401).send('Unauthorized');
    return;
  }

  const { error } = await supabase.from('visa_pulse').insert(
    todayRows.map(r => ({ ...r, created_at: new Date().toISOString().slice(0,10) }))
  );

  res.status(error ? 500 : 200).json({ ok: !error, error: error?.message });
});
