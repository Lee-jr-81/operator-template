# Seed / demo data

There is no seed-data framework. Create enough records in the dashboard (or SQL) to prove the clone.

Aim for:

| Record | Why |
|---|---|
| 2–4 Categories | Homepage and `/categories` |
| 2–3 Entities | Contact, location, Listings |
| 5–8 Listings | Cards, detail, Featured, Recently Added, duplicate |
| Images on some Listings | Gallery and cards |
| 1 current Deal | Badge and detail panel |
| 1 expired or inactive Deal | Must stay off the public site |
| 2 published Articles | Homepage and `/articles` |
| 1 draft Article | Must 404 publicly |
| Related Listings on one Article | Related block |
| Locations with coordinates | Listing map |

If the niche uses WhatsApp or Enquiry, give at least one Entity a usable phone and email.

If Build Specs stay off, do not seed them. They are config, not database rows.

Replace starter sample wording. The shipped `listing_details` columns are a starting vertical, not a product catalogue.

Do not commit real customer PII into the repository.
