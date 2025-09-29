# Supabase Integration for Ngọc Anh Services (Prep)

This repo is prepped to integrate with Supabase for:
- Secure file uploads (ID/passport) via Netlify Function -> Supabase Storage
- Optional DB inserts for form submissions (Visa, Send Money, VN Passport)

## What’s already wired
- `netlify/functions/upload-id.js` uploads files into Storage bucket **ids** using the **SERVICE ROLE** key (server-side only).
- Frontend pages call `/.netlify/functions/upload-id` when a user uploads an ID.

## New in this prep
- `src/lib/supabaseClient.js` – client SDK bootstrap (uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
- `src/lib/saveSubmission.js` – helper that **optionally** logs submissions into Supabase tables.
- `supabase/schema.sql` – tables for `visa_requests`, `send_money_requests`, `passport_requests`.
- `supabase/policies.sql` – safe RLS policies (row-level security) for public reads of **your own** rows only.
- `.env.example` – env var template.
- `package.json` now includes `@supabase/supabase-js`.

## One-time setup (Supabase project)
1. Create a Supabase project.
2. In SQL Editor, run **schema.sql** then **policies.sql**.
3. In **Storage**, create a bucket named **ids** (private). *(The Netlify function also creates it if missing and makes it public. Set to private if you prefer; then change `getPublicUrl` logic to signed URLs.)*
4. Copy your **Project URL** and **anon public key** (Project Settings → API).

## Configure Netlify env vars
Set these in Netlify → Site settings → Environment:
- `SUPABASE_URL` – your project URL
- `SUPABASE_SERVICE_ROLE_KEY` – service-role key (server-side only, do **NOT** expose in client)
- `RESEND_API_KEY` – for emails (already used by `send-email.js`)
- `VITE_SUPABASE_URL` – same as `SUPABASE_URL` (client)
- `VITE_SUPABASE_ANON_KEY` – anon public key (client)

Then **redeploy**.

## Local dev
Create a `.env` file based on `.env.example`.

```bash
npm i
npm run dev
```

## Where data goes
- Files: Supabase Storage bucket `ids` under path `${txId}/...`
- DB:
  - `visa_requests`
  - `send_money_requests`
  - `passport_requests`

The app only **attempts** to save to DB if client env vars are present. If missing, it silently skips so your build won’t break.

## Switching Storage to private (recommended)
- In `netlify/functions/upload-id.js`, replace the `getPublicUrl` with a call that generates a **signed URL** or just return the **path** and fetch signed URLs server-side for admins.