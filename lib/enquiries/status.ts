export const ENQUIRY_STATUSES = ["new", "reviewed", "closed"] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  closed: "Closed",
};

export function isEnquiryStatus(value: string): value is EnquiryStatus {
  return ENQUIRY_STATUSES.includes(value as EnquiryStatus);
}

export function asEnquiryStatus(value: string): EnquiryStatus {
  return isEnquiryStatus(value) ? value : "new";
}
