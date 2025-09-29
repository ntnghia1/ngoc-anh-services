-- Tables
create table if not exists public.visa_requests (
  id bigserial primary key,
  tx_id text not null,
  email text,
  phone text,
  full_name text,
  date_of_birth date,
  nationality text,
  issuing_country text,
  passport_number text,
  visa_type text,
  id_url text,
  raw jsonb,
  created_at timestamptz default now()
);

create table if not exists public.send_money_requests (
  id bigserial primary key,
  tx_id text not null,
  sender_name text,
  sender_email text,
  sender_phone text,
  amount_usd numeric,
  payout_method text,
  receive_country text,
  recipient_name text,
  recipient_phone text,
  notes text,
  id_url text,
  raw jsonb,
  created_at timestamptz default now()
);

create table if not exists public.passport_requests (
  id bigserial primary key,
  tx_id text not null,
  email text,
  phone text,
  full_name text,
  date_of_birth date,
  sex text,
  place_of_birth text,
  address_us text,
  address_vn text,
  occupation text,
  employer text,
  father_name text,
  father_dob date,
  mother_name text,
  mother_dob date,
  spouse_name text,
  spouse_dob date,
  depart_vn date,
  airport text,
  id_url text,
  raw jsonb,
  created_at timestamptz default now()
);