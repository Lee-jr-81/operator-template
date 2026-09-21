-- Editorial many-to-many between Articles and Listings.
-- The operator chooses related Listings. Nothing is inferred.
-- Public readers may only SELECT rows for published Articles whose
-- related Listing is active. Inactive or Draft Listings stay linked
-- for the operator but never appear on the public Article.

create table public.article_listings (
  article_id uuid not null references public.articles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (article_id, listing_id),
  constraint article_listings_sort_order_non_negative check (sort_order >= 0)
);

create index article_listings_listing_id_idx
  on public.article_listings (listing_id);

create index article_listings_article_id_sort_idx
  on public.article_listings (article_id, sort_order);

alter table public.article_listings enable row level security;

grant select on table public.article_listings to anon, authenticated;
grant insert, update, delete on table public.article_listings to authenticated;

create policy "Public can read published article relationships to active listings"
on public.article_listings
for select
to anon
using (
  exists (
    select 1
    from public.articles
    where articles.id = article_listings.article_id
      and articles.status = 'published'
      and articles.published_at is not null
      and articles.published_at <= now()
  )
  and exists (
    select 1
    from public.listings
    where listings.id = article_listings.listing_id
      and listings.status = 'active'
  )
);

create policy "Authenticated operator can select article listings"
on public.article_listings
for select
to authenticated
using (true);

create policy "Authenticated operator can insert article listings"
on public.article_listings
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update article listings"
on public.article_listings
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete article listings"
on public.article_listings
for delete
to authenticated
using (true);
