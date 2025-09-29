// netlify/functions/save-submission.js
import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok:false, error:'Method not allowed' }), { status:405 });
    }

    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ ok:false, error:'Missing Supabase env vars' }), { status:500 });
    }

    const { kind, record } = await req.json().catch(() => ({}));
    const table =
      kind === 'visa' ? 'visa_requests' :
      kind === 'send_money' ? 'send_money_requests' :
      kind === 'passport' ? 'passport_requests' : null;

    if (!table || !record) {
      return new Response(JSON.stringify({ ok:false, error:'Bad payload' }), { status:400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from(table).insert(record).select().single();
    if (error) throw error;

    return new Response(JSON.stringify({ ok:true, id: data?.id }), { status:200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error:String(err) }), { status:500 });
  }
};
