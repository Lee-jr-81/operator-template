-- Contact flow: WhatsApp click metric, listing contact channels, and
-- Enquiry status New / Reviewed / Closed.
--
-- whatsapp_clicks is intentionally narrow: Listing + timestamp only.
-- Public users cannot read clicks. Recording goes through
-- record_whatsapp_click(), which must not be required for the WhatsApp
-- link to open.
--
-- get_listing_contact_channels returns the Entity phone (for WhatsApp)
-- and whether an Entity email exists (for Enquiry). It does not return
-- the email address to the client.

create table public.whatsapp_clicks (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index whatsapp_clicks_listing_id_idx on public.whatsapp_clicks (listing_id);
create index whatsapp_clicks_created_at_idx on public.whatsapp_clicks (created_at desc);

alter table public.whatsapp_clicks enable row level security;

revoke all on table public.whatsapp_clicks from anon, public;
grant select on table public.whatsapp_clicks to authenticated;

create policy "Authenticated operator can select WhatsApp clicks"
on public.whatsapp_clicks
for select
to authenticated
using (true);

create or replace function public.record_whatsapp_click(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
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
set search_path = public
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

update public.enquiries
set status = 'reviewed'
where status = 'contacted';

alter table public.enquiries
  drop constraint enquiries_status_allowed;

alter table public.enquiries
  add constraint enquiries_status_allowed
  check (status in ('new', 'reviewed', 'closed'));

drop function if exists public.submit_public_enquiry(uuid, text, text, text, text);

create function public.submit_public_enquiry(
  p_listing_id uuid,
  p_name text,
  p_email text,
  p_phone text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
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
    p_name,
    p_email,
    nullif(btrim(p_phone), ''),
    p_message,
    'new'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_public_enquiry(uuid, text, text, text, text) from public;
grant execute on function public.submit_public_enquiry(uuid, text, text, text, text) to anon, authenticated;
