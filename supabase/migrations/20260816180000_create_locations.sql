-- Location is an independent reusable capability.
-- This Dog Services reference vertical attaches it to Entities only:
--   entities.location_id → locations.id ON DELETE SET NULL
-- A future niche may add listings.location_id explicitly. Do not use polymorphism.
--
-- Raw locations are operator-only. Public Listing pages read approved fields
-- through the entity_public view, not from the locations table.

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  address_line_1 text not null default '',
  address_line_2 text not null default '',
  town_city text not null default '',
  county_region text not null default '',
  postcode text not null default '',
  country text not null default '',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_label_length check (char_length(label) <= 80),
  constraint locations_address_line_1_length check (char_length(address_line_1) <= 120),
  constraint locations_address_line_2_length check (char_length(address_line_2) <= 120),
  constraint locations_town_city_length check (char_length(town_city) <= 80),
  constraint locations_county_region_length check (char_length(county_region) <= 80),
  constraint locations_postcode_length check (char_length(postcode) <= 20),
  constraint locations_country_length check (char_length(country) <= 80),
  constraint locations_latitude_range check (
    latitude is null or (latitude >= -90 and latitude <= 90)
  ),
  constraint locations_longitude_range check (
    longitude is null or (longitude >= -180 and longitude <= 180)
  )
);

create trigger locations_set_updated_at
before update on public.locations
for each row
execute function public.set_updated_at();

alter table public.entities
  add column location_id uuid references public.locations (id) on delete set null;

create index entities_location_id_idx on public.entities (location_id);

alter table public.locations enable row level security;

revoke all on table public.locations from anon, public;
grant select, insert, update, delete on table public.locations to authenticated;

create policy "Authenticated operator can select locations"
on public.locations
for select
to authenticated
using (true);

create policy "Authenticated operator can insert locations"
on public.locations
for insert
to authenticated
with check (true);

create policy "Authenticated operator can update locations"
on public.locations
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated operator can delete locations"
on public.locations
for delete
to authenticated
using (true);

drop view if exists public.entity_public;

create view public.entity_public
with (security_invoker = false)
as
select
  entities.id,
  entities.name,
  entities.slug,
  entities.logo_path,
  entities.public_description,
  case when entities.show_email then entities.email else null end as email,
  case when entities.show_phone then entities.phone else null end as phone,
  case when entities.show_website then entities.website_url else null end as website_url,
  locations.label as location_label,
  locations.town_city as location_town_city,
  locations.county_region as location_county_region,
  locations.postcode as location_postcode,
  locations.country as location_country,
  locations.latitude as location_latitude,
  locations.longitude as location_longitude
from public.entities
left join public.locations on locations.id = entities.location_id;

grant select on public.entity_public to anon, authenticated;
