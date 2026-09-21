-- Production hardening: tighten public projections, privileged RPCs,
-- enquiry updates, and storage upload limits.
--
-- entity_public is enumerable by anon. Restrict it to Entities that
-- currently have at least one public Listing.
-- SECURITY DEFINER functions use an empty search_path.
-- Authenticated clients may update enquiries.status only.
-- Storage buckets enforce MIME type and size at the bucket layer.

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
left join public.locations on locations.id = entities.location_id
where exists (
  select 1
  from public.listings
  where listings.entity_id = entities.id
    and listings.status = 'active'
);

grant select on public.entity_public to anon, authenticated;

revoke update on table public.enquiries from authenticated;
grant update (status) on table public.enquiries to authenticated;

create or replace function public.record_whatsapp_click(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.listings
    where listings.id = p_listing_id
      and listings.status = 'active'
  ) then
    return;
  end if;

  insert into public.whatsapp_clicks (listing_id)
  values (p_listing_id);
end;
$$;

revoke all on function public.record_whatsapp_click(uuid) from public;
grant execute on function public.record_whatsapp_click(uuid) to anon, authenticated;

create or replace function public.get_listing_contact_channels(p_listing_id uuid)
returns table (
  phone text,
  has_email boolean
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    nullif(btrim(entities.phone), '') as phone,
    (nullif(btrim(entities.email), '') is not null) as has_email
  from public.listings
  inner join public.entities on entities.id = listings.entity_id
  where listings.id = p_listing_id
    and listings.status = 'active';
$$;

revoke all on function public.get_listing_contact_channels(uuid) from public;
grant execute on function public.get_listing_contact_channels(uuid) to anon, authenticated;

create or replace function public.submit_public_enquiry(
  p_listing_id uuid,
  p_name text,
  p_email text,
  p_phone text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_name text := btrim(p_name);
  v_email text := btrim(p_email);
  v_phone text := nullif(btrim(coalesce(p_phone, '')), '');
  v_message text := btrim(p_message);
begin
  if v_name is null
    or char_length(v_name) < 1
    or char_length(v_name) > 80
    or v_email is null
    or char_length(v_email) < 3
    or char_length(v_email) > 254
    or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or v_message is null
    or char_length(v_message) < 10
    or char_length(v_message) > 2000
    or (
      v_phone is not null
      and (char_length(v_phone) < 6 or char_length(v_phone) > 40)
    )
  then
    raise exception 'invalid_enquiry' using errcode = 'P0001';
  end if;

  if not exists (
    select 1
    from public.listings
    inner join public.entities on entities.id = listings.entity_id
    where listings.id = p_listing_id
      and listings.status = 'active'
      and nullif(btrim(entities.email), '') is not null
  ) then
    raise exception 'listing_not_public' using errcode = 'P0001';
  end if;

  insert into public.enquiries (
    listing_id,
    name,
    email,
    phone,
    message,
    status
  )
  values (
    p_listing_id,
    v_name,
    v_email,
    v_phone,
    v_message,
    'new'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_public_enquiry(uuid, text, text, text, text) from public;
grant execute on function public.submit_public_enquiry(uuid, text, text, text, text) to anon, authenticated;

update storage.buckets
set
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id in ('listing-media', 'article-media');

update storage.buckets
set
  file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'entity-logos';
