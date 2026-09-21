-- Listings connect Category and Entity.
-- listing_details is the 1:1 vertical extension. Current columns are Dog Services
-- test data only and must be replaced when cloning a real niche.
--
-- listings.category_id and listings.entity_id use ON DELETE RESTRICT.
-- listing_details.listing_id uses ON DELETE CASCADE.

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  summary text not null,
  description text not null default '',
  category_id uuid not null references public.categories (id) on delete restrict,
  entity_id uuid not null references public.entities (id) on delete restrict,
  status text not null default 'active',
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_title_length check (char_length(title) between 1 and 120),
  constraint listings_slug_length check (char_length(slug) between 1 and 80),
  constraint listings_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint listings_slug_key unique (slug),
  constraint listings_summary_length check (char_length(summary) between 1 and 200),
  constraint listings_description_length check (char_length(description) <= 4000),
  constraint listings_status_allowed check (status in ('active', 'inactive')),
  constraint listings_seo_title_length check (char_length(seo_title) <= 70),
  constraint listings_seo_description_length check (char_length(seo_description) <= 160)
);

create index listings_category_id_idx on public.listings (category_id);
create index listings_entity_id_idx on public.listings (entity_id);
create index listings_status_idx on public.listings (status);

create trigger listings_set_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

create table public.listing_details (
  listing_id uuid primary key references public.listings (id) on delete cascade,
  service_format text not null default '',
  price_text text not null default '',
  duration_text text not null default '',
  constraint listing_details_service_format_length check (char_length(service_format) <= 80),
  constraint listing_details_price_text_length check (char_length(price_text) <= 80),
  constraint listing_details_duration_text_length check (char_length(duration_text) <= 80)
);

alter table public.listings enable row level security;
alter table public.listing_details enable row level security;

grant select on table public.listings to anon, authenticated;
grant insert, update, delete on table public.listings to authenticated;

grant select on table public.listing_details to anon, authenticated;
grant insert, update, delete on table public.listing_details to authenticated;

create policy "Public can read active listings"
on public.listings
for select
to anon
using (status = 'active');

create policy "Authenticated operator can select listings"
on public.listings
for select
to authenticated
using (true);

create policy "Authenticated operator can insert listings"
on public.listings
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update listings"
on public.listings
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete listings"
on public.listings
for delete
to authenticated
using (true);

create policy "Public can read details of active listings"
on public.listing_details
for select
to anon
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_details.listing_id
      and listings.status = 'active'
  )
);

create policy "Authenticated operator can select listing details"
on public.listing_details
for select
to authenticated
using (true);

create policy "Authenticated operator can insert listing details"
on public.listing_details
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update listing details"
on public.listing_details
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete listing details"
on public.listing_details
for delete
to authenticated
using (true);
