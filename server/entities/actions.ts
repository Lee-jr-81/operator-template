"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import {
  entityLogoPath,
  validateEntityLogo,
} from "@/server/entities/logo";
import {
  deleteEntityLogo,
  deleteEntityRecord,
  getEntityById,
  insertEntity,
  updateEntityLocationId,
  updateEntityLogoPath,
  updateEntityRecord,
  uploadEntityLogo,
} from "@/server/entities/queries";
import {
  DUPLICATE_SLUG_MESSAGE,
  ENTITY_SAVE_FAILED_MESSAGE,
  isRestrictDeleteError,
  isUniqueSlugError,
  parseEntityInput,
} from "@/server/entities/validation";
import type { EntityFieldErrors } from "@/server/entities/types";
import {
  deleteLocationIfUnused,
  insertLocation,
  updateLocationRecord,
} from "@/server/locations/queries";
import type { LocationInput } from "@/server/locations/types";
import {
  LOCATION_SAVE_FAILED_MESSAGE,
  parseLocationInput,
} from "@/server/locations/validation";

export type EntityFormState = {
  fieldErrors?: EntityFieldErrors;
  formError?: string;
} | null;

function readEntityForm(formData: FormData) {
  return parseEntityInput({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    contact_name: String(formData.get("contact_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    website_url: String(formData.get("website_url") ?? ""),
    show_email: formData.get("show_email") === "on",
    show_phone: formData.get("show_phone") === "on",
    show_website: formData.get("show_website") === "on",
    public_description: String(formData.get("public_description") ?? ""),
    operator_notes: String(formData.get("operator_notes") ?? ""),
  });
}

function readLocationForm(formData: FormData) {
  return parseLocationInput({
    label: String(formData.get("label") ?? ""),
    address_line_1: String(formData.get("address_line_1") ?? ""),
    address_line_2: String(formData.get("address_line_2") ?? ""),
    town_city: String(formData.get("town_city") ?? ""),
    county_region: String(formData.get("county_region") ?? ""),
    postcode: String(formData.get("postcode") ?? ""),
    country: String(formData.get("country") ?? ""),
    latitude: String(formData.get("latitude") ?? ""),
    longitude: String(formData.get("longitude") ?? ""),
  });
}

async function applyLocationChange(options: {
  entityId: string;
  existingLocationId: string | null;
  location: LocationInput | null;
  removeLocation: boolean;
}) {
  const { entityId, existingLocationId, location, removeLocation } = options;

  if (removeLocation) {
    if (!existingLocationId) {
      return {};
    }

    const { error } = await updateEntityLocationId(entityId, null);
    if (error) {
      console.error("Failed to detach entity location", { code: error.code });
      return { formError: LOCATION_SAVE_FAILED_MESSAGE };
    }

    const { error: cleanupError } = await deleteLocationIfUnused(
      existingLocationId,
    );
    if (cleanupError) {
      console.error("Failed to remove unused location", {
        code: cleanupError.code,
      });
    }

    return {};
  }

  if (!location) {
    return {};
  }

  if (existingLocationId) {
    const { error } = await updateLocationRecord(existingLocationId, location);
    if (error) {
      console.error("Failed to update location", { code: error.code });
      return { formError: LOCATION_SAVE_FAILED_MESSAGE };
    }

    return {};
  }

  const { data, error } = await insertLocation(location);
  if (error || !data) {
    console.error("Failed to create location", { code: error?.code });
    return { formError: LOCATION_SAVE_FAILED_MESSAGE };
  }

  const { error: attachError } = await updateEntityLocationId(entityId, data.id);
  if (attachError) {
    console.error("Failed to attach entity location", { code: attachError.code });
    await deleteLocationIfUnused(data.id);
    return { formError: LOCATION_SAVE_FAILED_MESSAGE };
  }

  return {};
}

function readLogoFile(formData: FormData) {
  const value = formData.get("logo");
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

async function applyLogoChange(options: {
  entityId: string;
  file: File | null;
  removeLogo: boolean;
  previousPath: string | null;
}) {
  const { entityId, file, removeLogo, previousPath } = options;

  if (file) {
    const validated = await validateEntityLogo(file);
    if ("error" in validated) {
      return { fieldError: validated.error };
    }

    const path = entityLogoPath(entityId, validated.extension);
    const { error } = await uploadEntityLogo(path, file);
    if (error) {
      console.error("Failed to upload entity logo", { code: error.name });
      return { formError: "The logo could not be uploaded. Please try again." };
    }

    const { error: pathError } = await updateEntityLogoPath(entityId, path);
    if (pathError) {
      console.error("Failed to save entity logo path", { code: pathError.code });
      return { formError: ENTITY_SAVE_FAILED_MESSAGE };
    }

    if (previousPath && previousPath !== path) {
      await deleteEntityLogo(previousPath);
    }

    return {};
  }

  if (removeLogo && previousPath) {
    await deleteEntityLogo(previousPath);
    const { error } = await updateEntityLogoPath(entityId, null);
    if (error) {
      console.error("Failed to remove entity logo", { code: error.code });
      return { formError: ENTITY_SAVE_FAILED_MESSAGE };
    }
  }

  return {};
}

export async function createEntity(
  _previousState: EntityFormState,
  formData: FormData,
): Promise<EntityFormState> {
  await requireOperator();

  const parsed = readEntityForm(formData);
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const locationParsed = readLocationForm(formData);
  if ("fieldErrors" in locationParsed) {
    return { fieldErrors: locationParsed.fieldErrors };
  }

  const location = "data" in locationParsed ? locationParsed.data : null;

  const logoFile = readLogoFile(formData);
  if (logoFile) {
    const validated = await validateEntityLogo(logoFile);
    if ("error" in validated) {
      return { fieldErrors: { logo: validated.error } };
    }
  }

  const { data, error } = await insertEntity(parsed.data);

  if (isUniqueSlugError(error)) {
    return { fieldErrors: { slug: DUPLICATE_SLUG_MESSAGE } };
  }

  if (error || !data) {
    console.error("Failed to create entity", { code: error?.code });
    return { formError: ENTITY_SAVE_FAILED_MESSAGE };
  }

  const logoResult = await applyLogoChange({
    entityId: data.id,
    file: logoFile,
    removeLogo: false,
    previousPath: null,
  });

  if (logoResult.fieldError) {
    redirect(`/dashboard/entities/${data.id}?status=created-logo-failed`);
  }

  if (logoResult.formError) {
    redirect(`/dashboard/entities/${data.id}?status=created-logo-failed`);
  }

  const locationResult = await applyLocationChange({
    entityId: data.id,
    existingLocationId: null,
    location,
    removeLocation: false,
  });

  if (locationResult.formError) {
    redirect(`/dashboard/entities/${data.id}?status=created-location-failed`);
  }

  redirect("/dashboard/entities?status=created");
}

export async function updateEntity(
  _previousState: EntityFormState,
  formData: FormData,
): Promise<EntityFormState> {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { formError: "That Entity could not be found." };
  }

  const parsed = readEntityForm(formData);
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const removeLocation = formData.get("remove_location") === "on";
  const locationParsed = readLocationForm(formData);
  if (!removeLocation && "fieldErrors" in locationParsed) {
    return { fieldErrors: locationParsed.fieldErrors };
  }

  const location =
    !removeLocation && "data" in locationParsed ? locationParsed.data : null;

  const existing = await getEntityById(id);
  if (!existing) {
    return { formError: "That Entity could not be found." };
  }

  const logoFile = readLogoFile(formData);
  if (logoFile) {
    const validated = await validateEntityLogo(logoFile);
    if ("error" in validated) {
      return { fieldErrors: { logo: validated.error } };
    }
  }

  const { data, error } = await updateEntityRecord(id, parsed.data);

  if (isUniqueSlugError(error)) {
    return { fieldErrors: { slug: DUPLICATE_SLUG_MESSAGE } };
  }

  if (error) {
    console.error("Failed to update entity", { code: error.code });
    return { formError: ENTITY_SAVE_FAILED_MESSAGE };
  }

  if (!data) {
    return { formError: "That Entity could not be found." };
  }

  const logoResult = await applyLogoChange({
    entityId: id,
    file: logoFile,
    removeLogo: formData.get("remove_logo") === "on",
    previousPath: existing.logo_path,
  });

  if (logoResult.fieldError) {
    return { fieldErrors: { logo: logoResult.fieldError } };
  }

  if (logoResult.formError) {
    return { formError: logoResult.formError };
  }

  const locationResult = await applyLocationChange({
    entityId: id,
    existingLocationId: existing.location_id,
    location,
    removeLocation,
  });

  if (locationResult.formError) {
    return { formError: locationResult.formError };
  }

  redirect("/dashboard/entities?status=updated");
}

export async function deleteEntity(formData: FormData) {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/dashboard/entities");
  }

  const existing = await getEntityById(id);
  if (!existing) {
    redirect("/dashboard/entities");
  }

  const { error } = await deleteEntityRecord(id);

  if (isRestrictDeleteError(error)) {
    redirect("/dashboard/entities?status=in-use");
  }

  if (error) {
    console.error("Failed to delete entity", { code: error.code });
    redirect("/dashboard/entities?status=delete-failed");
  }

  if (existing.logo_path) {
    await deleteEntityLogo(existing.logo_path);
  }

  if (existing.location_id) {
    await deleteLocationIfUnused(existing.location_id);
  }

  redirect("/dashboard/entities?status=deleted");
}
