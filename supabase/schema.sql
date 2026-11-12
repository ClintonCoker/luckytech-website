-- LuckyTech database. Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.

create table if not exists public.products (
  slug          text primary key,
  name          text not null,
  brand         text not null default '',
  category      text not null default 'smartphones'
                check (category in ('smartphones','tablets','budget','accessories','gadgets')),
  condition     text not null default 'New' check (condition in ('New','UK-Used')),
  price         integer not null check (price >= 0),
  compare_at    integer check (compare_at is null or compare_at >= 0),
  storage       text,
  ram           text,
  network       text check (network is null or network in ('4G','5G')),
  stock         integer check (stock is null or stock >= 0),
  images        text[] not null default '{}',
  description   text,
  featured      boolean not null default false,
  active        boolean not null default true,
  style         text not null default 'galaxy-a',
  tint          text[] not null default '{"#1f2330","#3a4157"}',
  sort_order    integer not null default 1000,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.orders (
  reference   text primary key,
  provider    text not null,
  total       integer not null,
  branch      text not null,
  items       jsonb not null,
  contact     jsonb not null,
  created_at  timestamptz not null default now()
);

-- Only the website's server (service role key) may read or write. Nothing is public.
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Records a paid order once and takes the items out of stock in the same step.
-- Returns false if this payment reference was already recorded (so stock is never taken twice).
create or replace function public.complete_order(
  p_reference text, p_provider text, p_total integer, p_branch text, p_items jsonb, p_contact jsonb
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
begin
  insert into orders(reference, provider, total, branch, items, contact)
  values (p_reference, p_provider, p_total, p_branch, p_items, p_contact)
  on conflict (reference) do nothing;
  if not found then
    return false;
  end if;
  for item in select * from jsonb_array_elements(p_items) loop
    update products
       set stock = greatest(stock - (item->>'qty')::int, 0), updated_at = now()
     where slug = item->>'slug' and stock is not null;
  end loop;
  return true;
end;
$$;

revoke all on function public.complete_order from public, anon, authenticated;

-- Public bucket for product photos (anyone can view; only the server can upload).
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;
