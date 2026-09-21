-- One photograph per Category. Used on public Category cards now, and
-- available later as the Category page hero. Not a gallery.

alter table public.categories
add column image_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'category-media',
  'category-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Public can read category media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'category-media');

create policy "Authenticated operator can upload category media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'category-media');

create policy "Authenticated operator can update category media"
on storage.objects
for update
to authenticated
using (bucket_id = 'category-media')
with check (bucket_id = 'category-media');

create policy "Authenticated operator can delete category media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'category-media');
