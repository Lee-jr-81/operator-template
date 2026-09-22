The core relationship is Category → Listing ← Entity. A Listing always belongs to one Category and one Entity. Deleting a Category or Entity that still has Listings is blocked (ON DELETE RESTRICT).

Category (categories)
Organises Listings. Fully public to read; only an authenticated operator can write.

Column	Type	Notes
id
uuid
Primary key
name
text
1–80 characters
slug
text
Unique, 1–80, lowercase kebab-case
description
text
1–500 characters
image_path
text
Optional. One photo, added later. Storage bucket category-media (jpeg/png/webp, 5 MB)
created_at, updated_at
timestamptz
updated_at set by trigger
Indexed on name.

Entity (entities)
The business, person, or organisation behind Listings. The table itself is operator-only. Anonymous visitors never select it directly.

Column	Type	Notes
id
uuid
Primary key
name
text
1–120 characters
slug
text
Unique, 1–80, kebab-case
logo_path
text
Optional. Bucket entity-logos
contact_name
text
Optional, ≤ 80. Never public
email, phone, website_url
text
Optional. Length limits 254 / 30 / 200
show_email, show_phone, show_website
boolean
Default false. Controls what the public view exposes
public_description
text
Default '', ≤ 500
operator_notes
text
Default '', ≤ 2000. Never public
location_id
uuid
Optional FK to locations, ON DELETE SET NULL
created_at, updated_at
timestamptz
Public pages read entity_public instead. That view returns id, name, slug, logo_path, public_description, and email/phone/website only when the matching show_* flag is true, plus a few location fields (label, town, county, postcode, country, lat/lng). It only includes Entities that currently have at least one active Listing. Street address lines stay off the view.

Listing (listings + listing_details)
The discoverable item. Core fields live on listings; niche-specific fields live on a 1:1 listing_details row.

listings

Column	Type	Notes
id
uuid
Primary key
title
text
1–120
slug
text
Unique, 1–80, kebab-case
summary
text
1–200
description
text
Default '', ≤ 4000
category_id
uuid
Required FK, ON DELETE RESTRICT
entity_id
uuid
Required FK, ON DELETE RESTRICT
status
text
'active' or 'inactive', default 'active'
is_featured
boolean
Default false. Merchandising only; inactive featured listings stay hidden
seo_title
text
Default '', ≤ 70
seo_description
text
Default '', ≤ 160
created_at, updated_at
timestamptz
Anonymous readers can only see status = 'active'. Authenticated operators can read and write every status. Indexes exist on category_id, entity_id, status, and a partial index on created_at desc for featured active listings.

listing_details (1:1, cascade-deletes with the Listing)

These columns are the Dog Services sample and are meant to be replaced when cloning a niche:

service_format (≤ 80)
price_text (≤ 80)
duration_text (≤ 80)
Public read is allowed only when the parent Listing is active.

Related, but separate tables

listing_media: many images per Listing (storage_path, alt_text, sort_order, one is_primary). Cascade-deletes with the Listing. Bucket listing-media.
Listings are also referenced by deals, enquiries, and article links. Those do not change the Listing columns themselves.