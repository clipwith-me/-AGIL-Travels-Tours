/** Enquiry status values + types — client-safe (no server-only deps). */
export const ENQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export type EnquiryType = "visa" | "tour" | "hotel" | "quote";
