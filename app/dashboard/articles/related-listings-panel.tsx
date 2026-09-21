"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listingMatchesRelatedSearch } from "@/lib/articles/related-listings";
import {
  addArticleListing,
  moveArticleListing,
  removeArticleListing,
} from "@/server/articles/related-actions";
import type { ArticleRelatedListing } from "@/server/articles/types";
import { LISTING_STATUS_LABELS } from "@/server/listings/status";
import type { ListingListItem } from "@/server/listings/types";

export function RelatedListingsPanel({
  articleId,
  selected,
  listings,
}: {
  articleId: string;
  selected: ArticleRelatedListing[];
  listings: ListingListItem[];
}) {
  const [query, setQuery] = useState("");
  const candidates = useMemo(() => {
    const selectedIds = new Set(selected.map((item) => item.listing_id));
    return listings.filter(
      (listing) =>
        !selectedIds.has(listing.id) &&
        listingMatchesRelatedSearch(listing, query),
    );
  }, [listings, query, selected]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-medium">Related Listings</h2>
        <p className="mt-2 text-sm leading-6 text-(--dash-muted-fg)">
          Link relevant marketplace Listings to this Article so readers can
          discover useful providers, products or opportunities after reading.
          Choose only Listings that genuinely help the reader continue from this
          Article. If none are linked, the public Article shows the latest
          marketplace Listings instead so the page does not end empty. Linked
          Listings appear first.
        </p>
      </div>

      {selected.length === 0 ? (
        <p className="text-sm text-(--dash-muted-fg)">No Listings linked yet.</p>
      ) : (
        <ol className="space-y-3">
          {selected.map((item, index) => (
            <li
              key={item.listing_id}
              className="rounded-md border border-(--dash-border) p-4"
            >
              <p className="font-medium text-(--dash-fg)">{item.title}</p>
              <p className="mt-1 text-sm text-(--dash-muted-fg)">
                {`${item.entity_name} · ${item.category_name} · ${LISTING_STATUS_LABELS[item.status]}`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={moveArticleListing}>
                  <input type="hidden" name="article_id" value={articleId} />
                  <input
                    type="hidden"
                    name="listing_id"
                    value={item.listing_id}
                  />
                  <input type="hidden" name="direction" value="up" />
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={index === 0}
                  >
                    Move up
                  </Button>
                </form>
                <form action={moveArticleListing}>
                  <input type="hidden" name="article_id" value={articleId} />
                  <input
                    type="hidden"
                    name="listing_id"
                    value={item.listing_id}
                  />
                  <input type="hidden" name="direction" value="down" />
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={index === selected.length - 1}
                  >
                    Move down
                  </Button>
                </form>
                <form action={removeArticleListing}>
                  <input type="hidden" name="article_id" value={articleId} />
                  <input
                    type="hidden"
                    name="listing_id"
                    value={item.listing_id}
                  />
                  <Button type="submit" variant="danger">
                    Remove
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="space-y-3 border-t border-(--dash-border) pt-5">
        <h3 className="text-sm font-medium text-(--dash-fg)">Add Listing</h3>
        {listings.length === 0 ? (
          <p className="text-sm text-(--dash-muted-fg)">
            Create a Listing first, then link it here.
          </p>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="related-listing-search">Search Listings</Label>
              <Input
                id="related-listing-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Title, Entity, or Category"
              />
            </div>
            {candidates.length === 0 ? (
              <p className="text-sm text-(--dash-muted-fg)">
                {selected.length === listings.length
                  ? "Every Listing is already linked."
                  : "No matching Listings."}
              </p>
            ) : (
              <ul className="space-y-3">
                {candidates.map((listing) => (
                  <li
                    key={listing.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-(--dash-border) p-4"
                  >
                    <div>
                      <p className="font-medium text-(--dash-fg)">
                        {listing.title}
                      </p>
                      <p className="mt-1 text-sm text-(--dash-muted-fg)">
                        {`${listing.entity_name} · ${listing.category_name} · ${LISTING_STATUS_LABELS[listing.status]}`}
                      </p>
                    </div>
                    <form action={addArticleListing}>
                      <input type="hidden" name="article_id" value={articleId} />
                      <input type="hidden" name="listing_id" value={listing.id} />
                      <Button type="submit" variant="secondary">
                        Add
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
