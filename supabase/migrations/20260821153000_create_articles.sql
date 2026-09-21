-- Articles: lightweight CMS content, not a page builder.
-- Public readers may only SELECT published Articles whose published_at
-- is present and not in the future. Drafts stay operator-only.
-- Hero images live in the article-media Storage bucket; the path is
-- stored on articles.hero_image_path. Application code removes the
-- Storage object when the image is replaced or the Article is deleted.

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text not null,
  body text not null,
  hero_image_path text,
  status text not null default 'draft',
  published_at timestamptz,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_title_length check (char_length(title) between 1 and 120),
  constraint articles_slug_length check (char_length(slug) between 1 and 80),
  constraint articles_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint articles_slug_key unique (slug),
  constraint articles_excerpt_length check (char_length(excerpt) between 1 and 280),
  constraint articles_body_length check (char_length(body) between 1 and 20000),
  constraint articles_hero_image_path_length check (
    hero_image_path is null or char_length(hero_image_path) between 1 and 300
  ),
  constraint articles_status_allowed check (status in ('draft', 'published')),
  constraint articles_published_has_date check (
    status <> 'published' or published_at is not null
  ),
  constraint articles_seo_title_length check (char_length(seo_title) <= 70),
  constraint articles_seo_description_length check (char_length(seo_description) <= 160)
);

create index articles_updated_at_idx on public.articles (updated_at desc);
create index articles_public_published_at_idx
  on public.articles (published_at desc)
  where status = 'published';

create trigger articles_set_updated_at
before update on public.articles
for each row
execute function public.set_updated_at();

alter table public.articles enable row level security;

grant select on table public.articles to anon, authenticated;
grant insert, update, delete on table public.articles to authenticated;

create policy "Public can read published articles"
on public.articles
for select
to anon
using (
  status = 'published'
  and published_at is not null
  and published_at <= now()
);

create policy "Authenticated operator can select articles"
on public.articles
for select
to authenticated
using (true);

create policy "Authenticated operator can insert articles"
on public.articles
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update articles"
on public.articles
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete articles"
on public.articles
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('article-media', 'article-media', true)
on conflict (id) do nothing;

create policy "Public can read article media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'article-media');

create policy "Authenticated operator can upload article media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'article-media');

create policy "Authenticated operator can update article media"
on storage.objects
for update
to authenticated
using (bucket_id = 'article-media')
with check (bucket_id = 'article-media');

create policy "Authenticated operator can delete article media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'article-media');
