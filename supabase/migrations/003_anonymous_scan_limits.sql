create table if not exists public.anonymous_scan_limits (
  ip_address text primary key,
  scan_count int not null default 0,
  last_scan_date date
);

alter table public.anonymous_scan_limits disable row level security;
