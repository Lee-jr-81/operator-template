"use client";

import { useState } from "react";
import { POSTCODE_GEOCODING_ENABLED } from "@/lib/location/config";
import { findLocationFromPostcode } from "@/server/locations/geocode-actions";
import type { EntityFieldErrors } from "@/server/entities/types";
import { LOCATION_POSTCODE_MAX } from "@/server/locations/validation";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LocationGeocodeFields({
  defaultPostcode,
  defaultLatitude,
  defaultLongitude,
  fieldErrors,
}: {
  defaultPostcode: string;
  defaultLatitude: number | null | undefined;
  defaultLongitude: number | null | undefined;
  fieldErrors?: Pick<
    EntityFieldErrors,
    "postcode" | "latitude" | "longitude"
  >;
}) {
  const [postcode, setPostcode] = useState(defaultPostcode);
  const [latitude, setLatitude] = useState(
    defaultLatitude == null ? "" : String(defaultLatitude),
  );
  const [longitude, setLongitude] = useState(
    defaultLongitude == null ? "" : String(defaultLongitude),
  );
  const [lookupPending, setLookupPending] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupSuccess, setLookupSuccess] = useState(false);
  const coordinateErrors = Boolean(
    fieldErrors?.latitude || fieldErrors?.longitude,
  );

  async function handleFindLocation() {
    if (lookupPending) {
      return;
    }

    setLookupPending(true);
    setLookupError(null);
    setLookupSuccess(false);

    const result = await findLocationFromPostcode(postcode);

    setLookupPending(false);

    if (!result.ok) {
      setLookupError(result.message);
      return;
    }

    setPostcode(result.postcode);
    setLatitude(String(result.latitude));
    setLongitude(String(result.longitude));
    setLookupSuccess(true);
  }

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="postcode">Postcode</Label>
        <p id="postcode-help" className="text-sm text-(--dash-muted-fg)">
          {POSTCODE_GEOCODING_ENABLED
            ? "Enter a UK postcode, then find location to place this Entity on the map."
            : "Optional. Map pins need latitude and longitude under the coordinate fields."}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <Input
            id="postcode"
            name="postcode"
            value={postcode}
            onChange={(event) => {
              setPostcode(event.target.value);
              setLookupSuccess(false);
            }}
            maxLength={LOCATION_POSTCODE_MAX}
            autoComplete="postal-code"
            aria-describedby="postcode-help"
            aria-invalid={Boolean(fieldErrors?.postcode)}
            className="sm:max-w-xs"
          />
          {POSTCODE_GEOCODING_ENABLED ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => void handleFindLocation()}
              disabled={lookupPending}
            >
              {lookupPending ? "Finding location…" : "Find location"}
            </Button>
          ) : null}
        </div>
        {fieldErrors?.postcode ? (
          <FormError>{fieldErrors.postcode}</FormError>
        ) : null}
        {lookupError ? <FormError>{lookupError}</FormError> : null}
        {lookupSuccess ? (
          <p role="status" className="text-sm text-(--dash-muted-fg)">
            Location found. Coordinates added automatically.
          </p>
        ) : null}
      </div>

      {POSTCODE_GEOCODING_ENABLED ? (
        <details
          className="rounded-md border border-(--dash-border) bg-(--dash-muted) p-4"
          open={coordinateErrors}
        >
          <summary className="cursor-pointer text-sm font-medium text-(--dash-fg)">
            Advanced / Manual coordinates
          </summary>
          <p className="mt-2 text-sm text-(--dash-muted-fg)">
            Use this if lookup is unavailable, or to correct a pin. Most
            operators can ignore these fields.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CoordinateFields
              latitude={latitude}
              longitude={longitude}
              onLatitudeChange={setLatitude}
              onLongitudeChange={setLongitude}
              fieldErrors={fieldErrors}
            />
          </div>
        </details>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <CoordinateFields
            latitude={latitude}
            longitude={longitude}
            onLatitudeChange={setLatitude}
            onLongitudeChange={setLongitude}
            fieldErrors={fieldErrors}
          />
        </div>
      )}
    </>
  );
}

function CoordinateFields({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  fieldErrors,
}: {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  fieldErrors?: Pick<EntityFieldErrors, "latitude" | "longitude">;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          name="latitude"
          value={latitude}
          onChange={(event) => onLatitudeChange(event.target.value)}
          inputMode="decimal"
          aria-invalid={Boolean(fieldErrors?.latitude)}
        />
        {fieldErrors?.latitude ? (
          <FormError>{fieldErrors.latitude}</FormError>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          name="longitude"
          value={longitude}
          onChange={(event) => onLongitudeChange(event.target.value)}
          inputMode="decimal"
          aria-invalid={Boolean(fieldErrors?.longitude)}
        />
        {fieldErrors?.longitude ? (
          <FormError>{fieldErrors.longitude}</FormError>
        ) : null}
      </div>
    </>
  );
}
