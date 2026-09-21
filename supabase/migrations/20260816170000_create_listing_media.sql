-- Listing media belongs to one Listing.
-- Database rows cascade when a Listing is deleted.
-- Storage objects in the listing-media bucket are removed by application code.

create table public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint listing_media_storage_path_length check (char_length(storage_path) between 1 and 300),
  constraint listing_media_alt_text_length check (char_length(alt_text) <= 160),
  constraint listing_media_sort_order_non_negative check (sort_order >= 0)
);

create index listing_media_listing_id_sort_idx
  on public.listing_media (listing_id, sort_order);

create unique index listing_media_one_primary_per_listing
  on public.listing_media (listing_id)
  where is_primary;

alter table public.listing_media enable row level security;

grant select on table public.listing_media to anon, authenticated;
grant insert, update, delete on table public.listing_media to authenticated;

create policy "Public can read media of active listings"
on public.listing_media
for select
to anon
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_media.listing_id
      and listings.status = 'active'
  )
);

create policy "Authenticated operator can select listing media"
on public.listing_media
for select
to authenticated
using (true);

create policy "Authenticated operator can insert listing media"
on public.listing_media
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update listing media"
on public.listing_media
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete listing media"
on public.listing_media
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('listing-media', 'listing-media', true)
on conflict (id) do nothing;

create policy "Public can read listing media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'listing-media');

create policy "Authenticated operator can upload listing media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'listing-media');

create policy "Authenticated operator can update listing media"
on storage.objects
for update
to authenticated
using (bucket_id = 'listing-media')
with check (bucket_id = 'listing-media');

create policy "Authenticated operator can delete listing media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'listing-media');
