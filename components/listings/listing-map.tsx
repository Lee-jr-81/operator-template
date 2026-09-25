"use client";

import { useEffect, useRef } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/cn";
import {
  EMPTY_MAP_VIEW,
  SINGLE_MARKER_ZOOM,
  getMapCamera,
  type ListingMapMarker,
} from "@/server/listings/map-markers";

// OpenFreeMap + MapLibre: no API key, commercial use allowed, restrained style.
// A clone that wants a vendor SLA can replace this URL with MapTiler or Mapbox.
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

// Next.js Turbopack cannot bundle MapLibre's worker (`new URL(..., import.meta.url)`).
// Serve the library from /public/maplibre instead. See scripts/copy-maplibre-worker.mjs.
const MAPLIBRE_MODULE_URL = "/maplibre/maplibre-gl.mjs";
const MAPLIBRE_WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

function applyCamera(map: MapLibreMap, markers: ListingMapMarker[]) {
  const camera = getMapCamera(markers);

  if (camera.kind === "bounds") {
    map.fitBounds(camera.bounds, {
      padding: 48,
      maxZoom: SINGLE_MARKER_ZOOM,
      duration: 0,
    });
    return;
  }

  map.setCenter(camera.center);
  map.setZoom(camera.zoom);
}

function createPopupElement(marker: ListingMapMarker) {
  const root = document.createElement("div");

  const title = document.createElement("a");
  title.href = `/listings/${marker.slug}`;
  title.textContent = marker.title;
  title.className =
    "font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline";
  root.append(title);

  const entity = document.createElement("p");
  entity.textContent = marker.entityName;
  entity.className = "mt-1 text-sm text-(--public-text-muted)";
  root.append(entity);

  if (marker.locationLabel) {
    const location = document.createElement("p");
    location.textContent = marker.locationLabel;
    location.className = "mt-1 text-sm text-(--public-text-muted)";
    root.append(location);
  }

  return root;
}

function collapseAttribution(container: HTMLElement) {
  const attrib = container.querySelector(".maplibregl-ctrl-attrib");
  if (!(attrib instanceof HTMLDetailsElement)) {
    return;
  }

  attrib.open = false;
  attrib.classList.remove("maplibregl-compact-show");
}

async function loadMapLibre() {
  const maplibre = (await import(
    /* webpackIgnore: true */
    /* turbopackIgnore: true */
    MAPLIBRE_MODULE_URL
  )) as typeof import("maplibre-gl");

  maplibre.setWorkerUrl(MAPLIBRE_WORKER_URL);
  return maplibre;
}

export function ListingMap({
  markers,
  ariaLabel = "Listing locations",
  className = "",
}: {
  markers: ListingMapMarker[];
  ariaLabel?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const markerInstances: Marker[] = [];
    let map: MapLibreMap | undefined;
    let cancelled = false;

    void loadMapLibre().then((maplibre) => {
      if (cancelled || !containerRef.current) {
        return;
      }

      const camera = getMapCamera(markers);
      map = new maplibre.Map({
        container,
        style: MAP_STYLE_URL,
        attributionControl: false,
        center:
          camera.kind === "bounds" ? EMPTY_MAP_VIEW.center : camera.center,
        zoom: camera.kind === "bounds" ? EMPTY_MAP_VIEW.zoom : camera.zoom,
      });

      map.addControl(
        new maplibre.NavigationControl({ showCompass: false }),
        "top-right",
      );
      map.addControl(
        new maplibre.AttributionControl({ compact: true }),
        "bottom-right",
      );

      map.on("load", () => {
        if (cancelled || !map) {
          return;
        }

        map.resize();
        applyCamera(map, markers);
        collapseAttribution(container);

        for (const marker of markers) {
          const popup = new maplibre.Popup({
            offset: 24,
            maxWidth: "220px",
          }).setDOMContent(createPopupElement(marker));

          const instance = new maplibre.Marker()
            .setLngLat([marker.longitude, marker.latitude])
            .setPopup(popup)
            .addTo(map);

          instance
            .getElement()
            .setAttribute(
              "aria-label",
              `${marker.title}. ${marker.entityName}`,
            );

          markerInstances.push(instance);
        }
      });

      map.once("idle", () => {
        if (!cancelled) {
          collapseAttribution(container);
        }
      });
    });

    return () => {
      cancelled = true;
      for (const instance of markerInstances) {
        instance.remove();
      }
      map?.remove();
    };
  }, [markers]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className={cn("h-full min-h-80 w-full", className)}
    />
  );
}
