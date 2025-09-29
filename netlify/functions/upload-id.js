// netlify/functions/upload-id.js
import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405 });
    }

    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing Supabase env vars' }), { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { txId, name, contentType, dataBase64 } = body || {};
    if (!txId || !name || !contentType || !dataBase64) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), { status: 400 });
    }

    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Ensure bucket exists (ignore error if already exists)
    await client.storage.createBucket('ids', { public: true }).catch(() => {});

    const path = `${txId}/${Date.now()}-${name}`.replace(/\s+/g, '_');
    const blob = Buffer.from(dataBase64, 'base64');

    const { error } = await client.storage.from('ids').upload(path, blob, {
      contentType,
      upsert: true,
    });
    if (error) throw error;

    const { data: pub } = client.storage.from('ids').getPublicUrl(path);
    return new Response(JSON.stringify({ ok: true, url: pub.publicUrl, path }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
};
