-- Categories: first OperatorMain domain table.
-- Listings do not exist yet. When they are added, listings.category_id
-- must use ON DELETE RESTRICT so a Category with Listings cannot be removed.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_length check (char_length(name) between 1 and 80),
  constraint categories_slug_length check (char_length(slug) between 1 and 80),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint categories_description_length check (char_length(description) between 1 and 500),
  constraint categories_slug_key unique (slug)
);

create index categories_name_idx on public.categories (name);

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

create policy "Public can read categories"
on public.categories
for select
to anon, authenticated
using (true);

create policy "Authenticated operator can insert categories"
on public.categories
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update categories"
on public.categories
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete categories"
on public.categories
for delete
to authenticated
using (true);
