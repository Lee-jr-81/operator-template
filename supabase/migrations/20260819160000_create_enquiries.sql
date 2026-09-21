-- Enquiries are visitor leads attached to a Listing.
-- Entity is not stored here; it is reached through listings.entity_id.
--
-- listing_id uses ON DELETE RESTRICT so Enquiry history is not silently
-- deleted when a Listing is removed. Deals still cascade; Enquiries do not.
--
-- Anonymous users cannot SELECT, UPDATE, or DELETE this table.
-- Public creation goes through submit_public_enquiry(), which only inserts
-- when the Listing is active, and does not return the stored row.

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete restrict,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enquiries_name_length check (char_length(name) between 1 and 80),
  constraint enquiries_email_length check (char_length(email) between 3 and 254),
  constraint enquiries_phone_length check (
    phone is null or char_length(phone) between 6 and 40
  ),
  constraint enquiries_message_length check (char_length(message) between 10 and 2000),
  constraint enquiries_status_allowed check (status in ('new', 'contacted', 'closed'))
);

create index enquiries_listing_id_idx on public.enquiries (listing_id);
create index enquiries_status_idx on public.enquiries (status);
create index enquiries_created_at_idx on public.enquiries (created_at desc);

create trigger enquiries_set_updated_at
before update on public.enquiries
for each row
execute function public.set_updated_at();

alter table public.enquiries enable row level security;

revoke all on table public.enquiries from anon, public;
grant select, update on table public.enquiries to authenticated;

create policy "Authenticated operator can select enquiries"
on public.enquiries
for select
to authenticated
using (true);

create policy "Authenticated operator can update enquiries"
on public.enquiries
for update
to authenticated
using (true)
with check (true);

create or replace function public.submit_public_enquiry(
  p_listing_id uuid,
  p_name text,
  p_email text,
  p_phone text,
  p_message text
)
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
  );
end;
$$;

revoke all on function public.submit_public_enquiry(uuid, text, text, text, text) from public;
grant execute on function public.submit_public_enquiry(uuid, text, text, text, text) to anon, authenticated;
