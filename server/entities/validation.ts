import {
  ENTITY_CONTACT_NAME_MAX,
  ENTITY_DESCRIPTION_MAX,
  ENTITY_EMAIL_MAX,
  ENTITY_NAME_MAX,
  ENTITY_NOTES_MAX,
  ENTITY_PHONE_MAX,
  ENTITY_WEBSITE_MAX,
  generateEntitySlug,
  isValidEntitySlug,
} from "@/server/entities/slug";
import type { EntityFieldErrors, EntityInput } from "@/server/entities/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+0-9()\s.-]{6,30}$/;

export function hasEntityFieldErrors(fieldErrors: EntityFieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}

function emptyToNull(value: string) {
  return value.length > 0 ? value : null;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseEntityInput(raw: {
  name: string;
  slug: string;
  contact_name: string;
  email: string;
  phone: string;
  website_url: string;
  show_email: boolean;
  show_phone: boolean;
  show_website: boolean;
  public_description: string;
  operator_notes: string;
}): { data: EntityInput } | { fieldErrors: EntityFieldErrors } {
  const name = raw.name.trim();
  const contactName = raw.contact_name.trim();
  const email = raw.email.trim();
  const phone = raw.phone.trim();
  const websiteUrl = raw.website_url.trim();
  const publicDescription = raw.public_description.trim();
  const operatorNotes = raw.operator_notes.trim();
  const slug = generateEntitySlug(raw.slug) || generateEntitySlug(name);

  const fieldErrors: EntityFieldErrors = {};

  if (!name) {
    fieldErrors.name = "Enter an Entity name.";
  } else if (name.length > ENTITY_NAME_MAX) {
    fieldErrors.name = `Use ${ENTITY_NAME_MAX} characters or fewer.`;
  }

  if (!slug) {
    fieldErrors.slug =
      "Enter a URL-safe slug, or use a name that can generate one.";
  } else if (!isValidEntitySlug(slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and hyphens only. Do not start or end with a hyphen.";
  }

  if (contactName.length > ENTITY_CONTACT_NAME_MAX) {
    fieldErrors.contact_name = `Use ${ENTITY_CONTACT_NAME_MAX} characters or fewer.`;
  }

  if (email) {
    if (email.length > ENTITY_EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
      fieldErrors.email = "Enter a valid email address.";
    }
  }

  if (phone) {
    if (phone.length > ENTITY_PHONE_MAX || !PHONE_PATTERN.test(phone)) {
      fieldErrors.phone =
        "Enter a phone number using digits and common symbols only.";
    }
  }

  if (websiteUrl) {
    if (websiteUrl.length > ENTITY_WEBSITE_MAX || !isHttpUrl(websiteUrl)) {
      fieldErrors.website_url =
        "Enter a website URL starting with http:// or https://.";
    }
  }

  if (publicDescription.length > ENTITY_DESCRIPTION_MAX) {
    fieldErrors.public_description = `Use ${ENTITY_DESCRIPTION_MAX} characters or fewer.`;
  }

  if (operatorNotes.length > ENTITY_NOTES_MAX) {
    fieldErrors.operator_notes = `Use ${ENTITY_NOTES_MAX} characters or fewer.`;
  }

  if (hasEntityFieldErrors(fieldErrors)) {
    return { fieldErrors };
  }

  return {
    data: {
      name,
      slug,
      contact_name: emptyToNull(contactName),
      email: emptyToNull(email),
      phone: emptyToNull(phone),
      website_url: emptyToNull(websiteUrl),
      show_email: raw.show_email,
      show_phone: raw.show_phone,
      show_website: raw.show_website,
      public_description: publicDescription,
      operator_notes: operatorNotes,
    },
  };
}

export function isUniqueSlugError(error: { code?: string } | null) {
  return error?.code === "23505";
}

export function isRestrictDeleteError(error: { code?: string } | null) {
  return error?.code === "23503";
}

export const DUPLICATE_SLUG_MESSAGE =
  "That slug is already used by another Entity. Choose a different one.";

export const ENTITY_SAVE_FAILED_MESSAGE =
  "The Entity could not be saved. Please try again.";
