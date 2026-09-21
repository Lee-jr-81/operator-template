# Location engine

Standing reference for OperatorTemplate location data.

> **OperatorTemplate provides the Location engine. Each niche decides at build time what uses it.**

> **Every new OperatorTemplate niche must explicitly decide whether Location belongs to Entity, Listing, both, or neither before implementation begins.**

Do not blindly attach Location to everything.

---

## 1. Why Location is a core capability

Location is common across verticals, but it is not a Listing field and it is not an Entity field.

Niches need geography for discovery, trust, and later maps. They do not share one attachment point:

- a dog walker is based at an Entity
- a track day happens at a Listing venue
- agricultural machinery may need both the dealer and the machine

The reusable piece is the `locations` table and validation. The relationship is chosen per clone.

---

## 2. Why Location is independent

`locations` is its own table. It stores structured address fields and optional coordinates.

It does not belong on `listings` or `entities` as a pile of columns. That would hard-wire one niche’s attachment point into the master.

It is also not a polymorphic `locationable_type / locationable_id` row. Explicit foreign keys stay readable:

```text
entities.location_id  →  locations.id
listings.location_id  →  locations.id   (only if a niche needs it)
```

This clone implements Entity Location only.

---

## 3. How a niche chooses the attachment

| Choice | When to use it | Example |
|---|---|---|
| Entity | The supply-side party has a base or service area | Dog Services |
| Listing | The discoverable item has its own place | Track Days |
| Both | Dealer/base and item can be in different places | Agricultural machinery |
| Neither | Geography is not useful yet | Rare; decide explicitly |

```text
Dog Services
Entity → Location
```

```text
Track Days
Listing → Location
```

```text
Agricultural Machinery
Entity → Location
Listing → Location
```

```text
Future niche
Entity → Location
Listing → Location
```

This template uses **Entity → Location**.

`entities.location_id` is nullable with `ON DELETE SET NULL`. An Entity can exist without a Location. Deleting a Location does not delete the Entity.

Do not add `listings.location_id` unless a niche brief requires it.

---

## 4. Why explicit foreign keys are preferred

A developer should see the relationship in the schema without learning a generic attachment framework.

- One nullable `location_id` on the table that owns it
- No `locationable_type`
- No shared join table for hypothetical future parents

If a clone later needs both Entity and Listing locations, add `listings.location_id` in that clone’s migration. Two explicit columns are clearer than one polymorphic system.

---

## 5. How to use Location in a clone

1. Decide Entity, Listing, both, or neither.
2. Keep the `locations` table and `server/locations/` code.
3. Add only the foreign key that niche needs.
4. Collect Location on the dashboard form of that parent.
5. Expose public fields through a projection, not by granting anonymous SELECT on `locations`.

Public Listing pages in this clone read Location through `entity_public` (Entities with at least one active Listing). Approved public fields:

- label
- town/city
- county/region
- postcode
- country
- latitude
- longitude

Street lines (`address_line_1`, `address_line_2`) stay operator-only. Public cards and Listing detail show a concise line such as `Stourbridge, West Midlands` when town/county exist. Coordinates are used by the public map; they are not printed as numbers on cards.

---

## 6. Operator behaviour in this clone

Location is edited on the Entity form. There is no Location dashboard item.

- Create or save an Entity without Location.
- Add Location, then edit the same Location row on later saves.
- Remove Location: `entities.location_id` is set to null, then an unused Location row is deleted.
- Deleting an Entity also deletes its Location if nothing else references it.

Do not implement address autocomplete or radius search here.

---

## 7. UK postcode geocoding

> **Geocoding providers are niche/deployment concerns. Latitude and longitude are the stable Location contract.**

> **Postcode is operator input. Coordinates are implementation data.**

UK platforms can enable **Postcodes.io** to fill latitude and longitude from a UK postcode. The template ships this off by default (`POSTCODE_GEOCODING_ENABLED` in `lib/location/config.ts`).

The Location table does not change. The map does not call Postcodes.io. Lookup happens on the operator Entity form, server-side, and writes coordinates into the existing Location fields.

```text
Postcode
   ↓
Postcodes.io          (UK reference only)
   ↓
Location.latitude / longitude
   ↓
Safe public marker mapper
   ↓
MapLibre
```

Do not couple MapLibre to Postcodes.io.

### Operator UX

- Enter a postcode and click **Find location**
- Success populates coordinates in the form; the operator still saves the Entity
- Lookup does not overwrite town, county, address, or label
- Latitude/longitude stay available under **Advanced / Manual coordinates**
- An Entity can still be saved if lookup fails or is skipped

### Clone configuration

`POSTCODE_GEOCODING_ENABLED` in `lib/location/config.ts` is a build-time flag.

| Clone | What to do |
|---|---|
| UK | set `true` |
| Non-UK with maps | leave `false` and enter coordinates manually, or replace `lib/location/postcodes-io.ts` with that country’s geocoder |
| No geography | leave `false`; Location and maps can stay unused |

Do not add operator geocoding settings.

### Northern Ireland

Postcodes.io serves `BT` postcodes. Great Britain postcode data is typically usable under OS OpenData terms. **Northern Ireland postcode data for commercial use may require a licence from Land & Property Services.** Check before a commercial NI launch. This is not enforced in code.

Channel Islands and Isle of Man records may return a postcode with null coordinates. Treat that as “could not place on the map”, not as a pin at 0,0.

---

## 8. Public map

> **The map consumes normalized public marker data. The niche decides whether marker data is sourced from Entity Location or Listing Location.**

The interactive map lives on the public **Listing detail** page when coordinates exist. `/listings` and Category pages show cards only.

The map is a discovery aid on the Listing itself. Listing cards remain the accessible source of truth.

### Provider

OperatorTemplate uses **MapLibre GL JS** with **OpenFreeMap** Positron tiles.

Why this pair:

- MapLibre is an open-source map engine with ordinary markers, popups, and fit-bounds
- the React usage is one Client Component and a `useEffect`, not a GIS framework
- OpenFreeMap allows commercial use without an API key, which suits low-volume operator businesses
- attribution is included in the style
- no extra vendor account is required to run the slice

The style URL is a single constant in `components/listings/listing-map.tsx`. A clone that wants a paid SLA (MapTiler, Mapbox) changes that URL. Do not add a provider-switching abstraction.

Next.js Turbopack cannot bundle MapLibre’s web worker. `scripts/copy-maplibre-worker.mjs` copies the library and worker files into `public/maplibre/` on install/dev/build. The map component loads those files from `/maplibre/…`, not through the bundler.

No map environment variables are required. Leaflet was not used because its common “free” raster CDNs are not production-legal for commercial apps without a contract.

### Marker data

The Client Component receives only:

```ts
type ListingMapMarker = {
  listingId: string
  slug: string
  title: string
  entityName: string
  locationLabel: string
  latitude: number
  longitude: number
}
```

It does not receive Entity rows, Location rows, operator notes, contact name, hidden contacts, or street address.

`toListingMapMarkers()` in `server/listings/map-markers.ts` is the mapper. It drops inactive Listings and missing/invalid coordinates.

This template fills that type from **Entity Location** via `entity_public`. A clone that stores location on the Listing would fill the same type from Listing Location. The map component does not change.

### Behaviour

- Active Listings with usable coordinates become markers
- Listings without coordinates stay in the card list and do not appear on the map
- Zero markers: cards still render; the map panel explains that coordinates are missing
- One marker: centre and a moderate zoom
- Several markers: fit bounds, with a max zoom so a tight cluster is not over-zoomed
- Two Listings at the same point use the single-marker view
- The empty-map fallback is a world-scale overview; change `EMPTY_MAP_VIEW` for the platform’s country
- Popup title, Entity name, concise location, and a link to Listing detail
- Popup text is set with DOM `textContent`, not HTML strings

Map JavaScript loads only on pages that render the map loader. Leaflet/MapLibre cannot run during SSR; the map is dynamically imported with `ssr: false` from a Client Component.
