import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

// If env missing, export null so callers can feature-detect.
export const supabase = (url && anon) ? createClient(url, anon) : null