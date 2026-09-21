-- Entities: supply-side parties behind future Listings.
-- When Listings are added, listings.entity_id must use ON DELETE RESTRICT.
--
-- Privacy: the entities table is operator-only. Anonymous readers use
-- entity_public, which never includes contact_name, operator_notes, or
-- contact details unless the operator marked them as public.

create table public.entities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  logo_path text,
  contact_name text,
  email text,
  phone text,
  website_url text,
  show_email boolean not null default false,
  show_phone boolean not null default false,
  show_website boolean not null default false,
  public_description text not null default '',
  operator_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entities_name_length check (char_length(name) between 1 and 120),
  constraint entities_slug_length check (char_length(slug) between 1 and 80),
  constraint entities_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint entities_slug_key unique (slug),
  constraint entities_contact_name_length check (contact_name is null or char_length(contact_name) <= 80),
  constraint entities_email_length check (email is null or char_length(email) <= 254),
  constraint entities_phone_length check (phone is null or char_length(phone) <= 30),
  constraint entities_website_length check (website_url is null or char_length(website_url) <= 200),
  constraint entities_public_description_length check (char_length(public_description) <= 500),
  constraint entities_operator_notes_length check (char_length(operator_notes) <= 2000)
);

create index entities_name_idx on public.entities (name);

create trigger entities_set_updated_at
before update on public.entities
for each row
execute function public.set_updated_at();

alter table public.entities enable row level security;

revoke all on table public.entities from anon, public;
grant select, insert, update, delete on table public.entities to authenticated;

create policy "Authenticated operator can select entities"
on public.entities
for select
to authenticated
using (true);

create policy "Authenticated operator can insert entities"
on public.entities
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update entities"
on public.entities
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete entities"
on public.entities
for delete
to authenticated
using (true);

-- Runs as the view owner so anonymous Listing pages can read the projection
-- without gaining SELECT on private Entity columns.
create view public.entity_public
with (security_invoker = false)
as
select
  id,
  name,
  slug,
  logo_path,
  public_description,
  case when show_email then email else null end as email,
  case when show_phone then phone else null end as phone,
  case when show_website then website_url else null end as website_url
from public.entities;

grant select on public.entity_public to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('entity-logos', 'entity-logos', true)
on conflict (id) do nothing;

create policy "Public can read entity logos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'entity-logos');

create policy "Authenticated operator can upload entity logos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'entity-logos');

create policy "Authenticated operator can update entity logos"
on storage.objects
for update
to authenticated
using (bucket_id = 'entity-logos')
with check (bucket_id = 'entity-logos');

create policy "Authenticated operator can delete entity logos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'entity-logos');
