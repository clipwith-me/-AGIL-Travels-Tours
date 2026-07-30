/**
 * UAE visa types and their document checklists (client-provided, exact).
 * Shared by the applicant form and the API validation. No server-only deps.
 */

export type DocType =
  | "passport_data_page"
  | "passport_photo"
  | "flight_ticket"
  | "proof_of_accommodation"
  | "bank_statement"
  | "other";

export type RequiredDoc = {
  type: DocType;
  label: string;
  hint?: string;
};

export type VisaType = {
  id: "96hrs" | "30-day" | "60-day";
  name: string;
  summary: string;
  documents: RequiredDoc[];
};

const passportData: RequiredDoc = {
  type: "passport_data_page",
  label: "Passport data page",
  hint: "Minimum 6 months validity.",
};
const passportPhoto: RequiredDoc = {
  type: "passport_photo",
  label: "Passport photo",
  hint: "White background.",
};
const accommodation: RequiredDoc = {
  type: "proof_of_accommodation",
  label: "Proof of accommodation",
};

export const VISA_TYPES: VisaType[] = [
  {
    id: "96hrs",
    name: "96-Hour Visa",
    summary: "Short transit / quick visit (up to 96 hours).",
    documents: [
      passportData,
      passportPhoto,
      {
        type: "flight_ticket",
        label: "Confirmed Emirates flight ticket",
      },
      accommodation,
      {
        type: "bank_statement",
        label: "6-month bank statement",
        hint: "Showing an equivalent balance of USD 10,000 for each of the last 6 months.",
      },
    ],
  },
  {
    id: "30-day",
    name: "30-Day Visit Visa",
    summary: "Single-entry visit visa valid for 30 days.",
    documents: [
      passportData,
      passportPhoto,
      { type: "flight_ticket", label: "Flight ticket" },
      accommodation,
    ],
  },
  {
    id: "60-day",
    name: "60-Day Visit Visa",
    summary: "Single-entry visit visa valid for 60 days.",
    documents: [
      passportData,
      passportPhoto,
      { type: "flight_ticket", label: "Flight ticket" },
      accommodation,
    ],
  },
];

export const VISA_NOTE =
  "Some nationalities may require additional documents (e.g. national ID). Our team will confirm if anything further is needed.";

export function getVisaType(id: string): VisaType | undefined {
  return VISA_TYPES.find((v) => v.id === id);
}

export const VISA_STATUSES = [
  "submitted",
  "under_review",
  "approved",
  "declined",
] as const;
export type VisaStatus = (typeof VISA_STATUSES)[number];

export const STATUS_LABELS: Record<VisaStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  declined: "Declined",
};
