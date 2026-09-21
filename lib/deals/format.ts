import { BUSINESS } from "@/config/business";

const dateFormatter = new Intl.DateTimeFormat(BUSINESS.locale.language, {
  dateStyle: "long",
});

const dateTimeFormatter = new Intl.DateTimeFormat(BUSINESS.locale.language, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDealExpiry(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return dateFormatter.format(date);
}

export function formatDealDateTime(value: string | null) {
  if (!value) {
    return "Immediately";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return dateTimeFormatter.format(date);
}

export function toDatetimeLocalValue(value: string | null) {
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
