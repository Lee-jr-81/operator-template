"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LISTING_MEDIA_ALT_MAX,
  LISTING_MEDIA_MAX_PER_LISTING,
  canAddListingMedia,
  type ListingMedia,
} from "@/server/listings/media";
import {
  deleteListingMedia,
  moveListingMedia,
  replaceListingMedia,
  setPrimaryListingMedia,
  updateListingMediaAltText,
  uploadListingMedia,
  type ListingMediaFormState,
} from "@/server/listings/media-actions";

type MediaItem = ListingMedia & { url: string };

export function ListingMediaPanel({
  listingId,
  media,
}: {
  listingId: string;
  media: MediaItem[];
}) {
  const [state, formAction, pending] = useActionState<
    ListingMediaFormState,
    FormData
  >(uploadListingMedia, null);
  const canAdd = canAddListingMedia(media.length);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-medium">Images</h2>
        <p className="mt-1 text-sm leading-6 text-(--dash-muted-fg)">
          JPEG, PNG, or WebP, up to 5MB each. The first image becomes the
          primary image used on cards. You can change that, reorder, or replace
          images here.
        </p>
      </div>

      {canAdd ? (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="listing_id" value={listingId} />
          <div className="space-y-1.5">
            <Label htmlFor="image">Add image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alt_text">Alt text</Label>
            <p id="alt-help" className="text-sm text-(--dash-muted-fg)">
              Briefly describe what is shown in this image. This helps
              accessibility and gives search engines useful context.
            </p>
            <Input
              id="alt_text"
              name="alt_text"
              maxLength={LISTING_MEDIA_ALT_MAX}
              aria-describedby="alt-help"
            />
          </div>
          {state?.formError ? <FormError>{state.formError}</FormError> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Uploading…" : "Upload image"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-(--dash-muted-fg)">
          This Listing already has {LISTING_MEDIA_MAX_PER_LISTING} images, the
          maximum.
        </p>
      )}

      {media.length === 0 ? (
        <p className="text-sm text-(--dash-muted-fg)">No images yet.</p>
      ) : (
        <ul className="space-y-6">
          {media.map((item, index) => (
            <li
              key={item.id}
              className="space-y-3 rounded-md border border-(--dash-border) p-4"
            >
              <div className="flex flex-wrap items-start gap-4">
                <Image
                  src={item.url}
                  alt={item.alt_text || "Listing image"}
                  width={160}
                  height={120}
                  className="h-24 w-32 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  {item.is_primary ? (
                    <p className="text-sm font-medium text-(--dash-fg)">
                      Primary image
                    </p>
                  ) : (
                    <form action={setPrimaryListingMedia}>
                      <input type="hidden" name="listing_id" value={listingId} />
                      <input type="hidden" name="media_id" value={item.id} />
                      <Button type="submit" variant="secondary">
                        Set as primary
                      </Button>
                    </form>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <form action={moveListingMedia}>
                      <input type="hidden" name="listing_id" value={listingId} />
                      <input type="hidden" name="media_id" value={item.id} />
                      <input type="hidden" name="direction" value="up" />
                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={index === 0}
                      >
                        Move up
                      </Button>
                    </form>
                    <form action={moveListingMedia}>
                      <input type="hidden" name="listing_id" value={listingId} />
                      <input type="hidden" name="media_id" value={item.id} />
                      <input type="hidden" name="direction" value="down" />
                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={index === media.length - 1}
                      >
                        Move down
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              <form action={updateListingMediaAltText} className="space-y-2">
                <input type="hidden" name="listing_id" value={listingId} />
                <input type="hidden" name="media_id" value={item.id} />
                <Label htmlFor={`alt-${item.id}`}>Alt text</Label>
                <Input
                  id={`alt-${item.id}`}
                  name="alt_text"
                  defaultValue={item.alt_text}
                  maxLength={LISTING_MEDIA_ALT_MAX}
                />
                <Button type="submit" variant="secondary">
                  Save alt text
                </Button>
              </form>

              <form action={replaceListingMedia} className="space-y-2">
                <input type="hidden" name="listing_id" value={listingId} />
                <input type="hidden" name="media_id" value={item.id} />
                <Label htmlFor={`replace-${item.id}`}>Replace image</Label>
                <Input
                  id={`replace-${item.id}`}
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                />
                <Button type="submit" variant="secondary">
                  Replace
                </Button>
              </form>

              <form action={deleteListingMedia}>
                <input type="hidden" name="listing_id" value={listingId} />
                <input type="hidden" name="media_id" value={item.id} />
                <Button type="submit" variant="danger">
                  Remove image
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
