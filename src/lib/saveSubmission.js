// src/lib/saveSubmission.js
import { supabase } from './supabaseClient';

/**
 * Save a submission. Tries client insert first (anon).
 * If RLS blocks or client/env missing, falls back to Netlify Function (service role).
 * @param {'visa'|'send_money'|'passport'} kind
 * @param {object} record
 */
export async function saveSubmission(kind, record) {
  // Try client insert (browser; anon role)
  try {
    if (supabase) {
      const table = {
        visa: 'visa_requests',
        send_money: 'send_money_requests',
        passport: 'passport_requests',
      }[kind];

      if (table) {
        const { data, error } = await supabase
          .from(table)
          .insert(record)
          .select()
          .maybeSingle();

        if (!error && data) return { ok: true, id: data.id, via: 'client' };

        // If RLS (42501) or anything else, we fall through to server
        console.warn('Client insert failed, falling back to function:', error);
      }
    } else {
      console.warn('Supabase client missing (no VITE envs); using function fallback');
    }
  } catch (err) {
    console.warn('Client insert threw, using function fallback:', err);
  }

  // Server fallback (service role via Netlify Function)
  try {
    const r = await fetch('/.netlify/functions/save-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, record }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j?.ok) return { ok: true, id: j.id, via: 'function' };
    return { ok: false, error: j?.error || 'server insert failed' };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
