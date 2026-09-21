import { BUSINESS } from "@/config/business";

const dateFormatter = new Intl.DateTimeFormat(BUSINESS.locale.language, {
  dateStyle: "long",
});

const dateTimeFormatter = new Intl.DateTimeFormat(BUSINESS.locale.language, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatArticlePublishedDate(value: string | null) {
  if (!value) {
    return "Not published";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return dateFormatter.format(date);
}

export function formatArticleDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return dateTimeFormatter.format(date);
}

export function toArticleDatetimeLocalValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
