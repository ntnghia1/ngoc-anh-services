-- Enable RLS
alter table public.visa_requests enable row level security;
alter table public.send_money_requests enable row level security;
alter table public.passport_requests enable row level security;

-- This assumes you'll attach auth later.
-- For now, allow inserts from anon (client) but no selects.
-- Admins can query via SQL editor or a service key.
drop policy if exists "anon_insert_only_visa" on public.visa_requests;
create policy "anon_insert_only_visa"
  on public.visa_requests for insert
  to anon
  with check (true);

drop policy if exists "anon_insert_only_send" on public.send_money_requests;
create policy "anon_insert_only_send"
  on public.send_money_requests for insert
  to anon
  with check (true);

drop policy if exists "anon_insert_only_passport" on public.passport_requests;
create policy "anon_insert_only_passport"
  on public.passport_requests for insert
  to anon
  with check (true);

-- Block selects for anon (no need to add a select policy).