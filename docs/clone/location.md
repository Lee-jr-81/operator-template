# Location

Location is a reusable capability. It is not automatically attached to every record.

Standing reference: `docs/architecture/location.md`.

## Current template choice

This template attaches Location to **Entity**:

```text
entities.location_id → locations.id
```

Street address is operator-only. Public `entity_public` exposes a concise label, town, county, postcode, country, and coordinates when present.

The Listing detail map reads Entity coordinates. The map library only understands `lat` / `lng`.

## What a clone may choose

A niche may attach Location to:

- Entity (provider base)
- Listing (the thing is somewhere else)
- both
- neither

Do that with an explicit foreign key in a migration. Do not add a polymorphic `locationable_type` column. Do not add a dashboard “location attachment mode” setting.

## Geocoding vs maps

They are separate:

| Concern | This template |
|---|---|
| Store coordinates | `locations.latitude` / `longitude` |
| Fill coordinates from a UK postcode | Postcodes.io via `lib/location/postcodes-io.ts` when `POSTCODE_GEOCODING_ENABLED` is true |
| Draw a map | MapLibre on Listing detail, client-loaded |

UK postcode lookup is **off by default**. Set `POSTCODE_GEOCODING_ENABLED` to `true` in `lib/location/config.ts` only for UK platforms. For a non-UK platform:

- replace the lookup, or
- let the operator type coordinates, or
- omit maps

`lat` / `lng` remains the stable map contract.

## What not to do

- Do not put street address on public Entity or Listing cards
- Do not fetch raw `locations` with the anon key
- Do not send unbounded strings to the geocoder (input is already capped)
