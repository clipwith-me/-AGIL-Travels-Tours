/**
 * Shared option lists for the enquiry forms. Safe to import from both client
 * components and server code (no server-only dependencies here).
 */

// Tier-2 visa enquiry countries (UAE has its own full application flow — Week 2).
export const VISA_COUNTRIES = [
  "United Kingdom",
  "United States",
  "Schengen (Europe)",
  "Canada",
  "Other",
] as const;

export const VISA_TYPES = [
  "Tourist / Visit",
  "Student",
  "Work",
  "Business",
  "Family / Visit relatives",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Not sure yet",
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
] as const;
