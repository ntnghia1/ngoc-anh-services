// netlify/functions/upload-id.js
// Accepts JSON: { txId, name, contentType, dataBase64 } and uploads to Supabase Storage "ids" bucket
export default async (req, context) => {
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

    // Lazy import to avoid bundling issues
    const sup = await import('https://esm.sh/@supabase/supabase-js@2');
    const { createClient } = sup;

    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const path = `${txId}/${Date.now()}-${name}`.replace(/\s+/g, '_');
    const blob = Buffer.from(dataBase64, 'base64');

    // Ensure bucket exists (ignore error if already exists)
    await client.storage.createBucket('ids', { public: true }).catch(() => {});

    const { data, error } = await client.storage.from('ids').upload(path, blob, {
      contentType,
      upsert: true
    });
    if (error) throw error;

    const { data: pub } = client.storage.from('ids').getPublicUrl(path);
    return new Response(JSON.stringify({ ok: true, url: pub.publicUrl, path }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
};
