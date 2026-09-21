-- Deals are operator-sourced promotional offers attached to a Listing.
-- They are separate rows, not columns on listings, so a Listing can exist
-- without a Deal and a Deal can expire without changing the Listing.
--
-- deals.listing_id uses ON DELETE CASCADE: a Deal has no meaning without
-- its Listing. Public readers only see current Deals on active Listings.
-- Expiry is evaluated at query time (now()), so no cron job is required.

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  headline text not null,
  description text not null,
  promo_code text,
  starts_at timestamptz,
  expires_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deals_headline_length check (char_length(headline) between 1 and 120),
  constraint deals_description_length check (char_length(description) between 1 and 2000),
  constraint deals_promo_code_length check (
    promo_code is null or char_length(promo_code) between 1 and 40
  ),
  constraint deals_expiry_after_start check (
    starts_at is null or expires_at > starts_at
  )
);

create index deals_listing_id_idx on public.deals (listing_id);
create index deals_expires_at_idx on public.deals (expires_at);

create trigger deals_set_updated_at
before update on public.deals
for each row
execute function public.set_updated_at();

alter table public.deals enable row level security;

grant select on table public.deals to anon, authenticated;
grant insert, update, delete on table public.deals to authenticated;

create policy "Public can read current deals on active listings"
on public.deals
for select
to anon
using (
  is_active = true
  and (starts_at is null or starts_at <= now())
  and expires_at > now()
  and exists (
    select 1
    from public.listings
    where listings.id = deals.listing_id
      and listings.status = 'active'
  )
);

create policy "Authenticated operator can select deals"
on public.deals
for select
to authenticated
using (true);

create policy "Authenticated operator can insert deals"
on public.deals
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update deals"
on public.deals
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete deals"
on public.deals
for delete
to authenticated
using (true);
