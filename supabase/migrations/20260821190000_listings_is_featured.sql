-- Featured is an operator merchandising flag on Listings.
-- It does not change public eligibility. Inactive Featured Listings
-- stay hidden. Partial index supports the homepage Featured query.

alter table public.listings
  add column is_featured boolean not null default false;

create index listings_public_featured_created_at_idx
  on public.listings (created_at desc)
  where is_featured and status = 'active';
