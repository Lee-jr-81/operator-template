import type { EnquiryStatus } from "@/lib/enquiries/status";

export type Enquiry = {
  id: string;
  listing_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
};

export type EnquiryInput = {
  listing_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
};

export type EnquiryListItem = {
  id: string;
  name: string;
  status: EnquiryStatus;
  created_at: string;
  listing_id: string;
  listing_title: string;
  listing_slug: string;
  entity_name: string;
};

export type EnquiryDetail = Enquiry & {
  listing_title: string;
  listing_slug: string;
  listing_status: string;
  entity_name: string;
  entity_email: string | null;
  category_name: string;
};

export type EnquiryFieldErrors = {
  listing_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};
