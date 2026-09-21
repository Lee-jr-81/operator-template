import { BUSINESS } from "@/config/business";

const dateTimeFormatter = new Intl.DateTimeFormat(BUSINESS.locale.language, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatEnquiryReceived(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return dateTimeFormatter.format(date);
}
