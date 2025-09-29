import { supabase } from './supabaseClient'

/**
 * Save a submission into Supabase. No-op if env/SDK not configured.
 * @param {'visa'|'send_money'|'passport'} kind
 * @param {object} record
 */
export async function saveSubmission(kind, record) {
  if (!supabase) return { ok: false, skipped: true }

  const map = {
    visa: 'visa_requests',
    send_money: 'send_money_requests',
    passport: 'passport_requests',
  }
  const table = map[kind]
  if (!table) return { ok: false, error: 'unknown kind' }

  const { data, error } = await supabase.from(table).insert(record).select().single()
  if (error) return { ok: false, error: String(error) }
  return { ok: true, id: data?.id }
}