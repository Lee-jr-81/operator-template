"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prepareImageForUpload } from "@/lib/uploads/prepare-image";
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
  storeListingMedia,
  updateListingMediaAltText,
} from "@/server/listings/media-actions";

type MediaItem = ListingMedia & { url: string };

export function ListingMediaPanel({
  listingId,
  media,
}: {
  listingId: string;
  media: MediaItem[];
}) {
  const router = useRouter();
  const [fileCount, setFileCount] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);
  const canAdd = canAddListingMedia(media.length);

  async function onAddImages(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("image");
    const files =
      input instanceof HTMLInputElement && input.files
        ? [...input.files]
        : [];

    if (files.length === 0) {
      setFormError("Choose an image to upload.");
      return;
    }

    const altInput = form.elements.namedItem("alt_text");
    const altText =
      files.length === 1 && altInput instanceof HTMLInputElement
        ? altInput.value
        : "";

    setFormError(null);

    for (let index = 0; index < files.length; index += 1) {
      setPendingLabel(
        files.length === 1
          ? "Uploading…"
          : `Uploading ${index + 1} of ${files.length}…`,
      );

      let prepared: File;
      try {
        prepared = await prepareImageForUpload(files[index]);
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : "This image could not be prepared. Please try again.",
        );
        router.refresh();
        setPendingLabel(null);
        return;
      }

      const data = new FormData();
      data.set("listing_id", listingId);
      data.set("image", prepared);
      data.set("alt_text", altText);
      const result = await storeListingMedia(data);
      if (result?.formError) {
        setFormError(result.formError);
        router.refresh();
        setPendingLabel(null);
        return;
      }
    }

    setPendingLabel(null);
    router.push(`/dashboard/listings/${listingId}?status=media-added`);
    router.refresh();
  }

  async function onReplaceImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("image");
    const file =
      input instanceof HTMLInputElement ? input.files?.[0] : undefined;

    if (!file) {
      setFormError("Choose an image to upload.");
      return;
    }

    setFormError(null);
    setPendingLabel("Uploading…");

    let prepared: File;
    try {
      prepared = await prepareImageForUpload(file);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "This image could not be prepared. Please try again.",
      );
      setPendingLabel(null);
      return;
    }

    const data = new FormData(form);
    data.set("image", prepared);
    await replaceListingMedia(data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-medium">Images</h2>
        <p className="mt-1 text-sm leading-6 text-(--dash-muted-fg)">
          JPEG, PNG, or WebP. Large photos are reduced automatically. Choose
          several images at once. The first image becomes the primary image
          used on cards. You can change that, reorder, or replace images here.
        </p>
      </div>

      {canAdd ? (
        <form onSubmit={onAddImages} className="space-y-4">
          <input type="hidden" name="listing_id" value={listingId} />
          <div className="space-y-1.5">
            <Label htmlFor="image">Add images</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              required
              onChange={(event) =>
                setFileCount(event.currentTarget.files?.length ?? 0)
              }
            />
          </div>
          {fileCount > 1 ? (
            <p className="text-sm text-(--dash-muted-fg)">
              Add a short description on each image after they upload.
            </p>
          ) : (
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
          )}
          {formError ? <FormError>{formError}</FormError> : null}
          <Button type="submit" disabled={pendingLabel !== null}>
            {pendingLabel ?? (fileCount > 1 ? "Upload images" : "Upload image")}
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

              <form onSubmit={onReplaceImage} className="space-y-2">
                <input type="hidden" name="listing_id" value={listingId} />
                <input type="hidden" name="media_id" value={item.id} />
                <Label htmlFor={`replace-${item.id}`}>Replace image</Label>
                <Input
                  id={`replace-${item.id}`}
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                />
                <Button type="submit" variant="secondary" disabled={pendingLabel !== null}>
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
