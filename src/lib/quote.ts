/**
 * Instant-quote estimator. Client-safe (no server deps).
 *
 * ⚠️ RATES ARE PLACEHOLDERS — the client must confirm/replace every value in
 * QUOTE_RATES below. Results are shown to customers as *indicative estimates*,
 * not final prices, and a formal quote follows from the team.
 *
 * All base rates are in AED. USD is shown via a fixed display conversion.
 */

export type ServiceKey = "flight" | "hotel" | "visa" | "tour" | "transfer";

export const SERVICES: { key: ServiceKey; label: string; note: string }[] = [
  { key: "flight", label: "Flights", note: "Return flight, per traveller" },
  { key: "hotel", label: "Hotel", note: "Per room, per night" },
  { key: "visa", label: "Visa", note: "Our service fee, per applicant" },
  { key: "tour", label: "UAE tour", note: "Per traveller" },
  { key: "transfer", label: "Airport transfer", note: "Per group" },
];

export type HotelRating = "3" | "4" | "5";

export const TOUR_OPTIONS: { value: string; label: string }[] = [
  { value: "desert-safari", label: "Desert Safari" },
  { value: "landmarks", label: "Landmarks" },
  { value: "theme-parks", label: "Theme Parks" },
  { value: "cruises", label: "Cruises" },
  { value: "adventure", label: "Adventure" },
  { value: "nature-wildlife", label: "Nature & Wildlife" },
];

// --- PLACEHOLDER RATES (AED) — client to confirm ---------------------------
export const QUOTE_RATES = {
  flightPerTraveller: 1800, // indicative economy return
  hotelNightly: { "3": 280, "4": 520, "5": 950 } as Record<HotelRating, number>,
  visaPerApplicant: 350, // AGIL service fee (excludes government/embassy fees)
  tourPerTraveller: {
    "desert-safari": 210,
    landmarks: 90,
    "theme-parks": 320,
    cruises: 260,
    adventure: 300,
    "nature-wildlife": 180,
  } as Record<string, number>,
  transferFlat: 150,
};

export const AED_PER_USD = 3.67;

export type QuoteInput = {
  travellers: number;
  nights: number;
  hotelRating: HotelRating;
  tourCategory: string;
  services: Record<ServiceKey, boolean>;
};

export type QuoteLine = { key: ServiceKey; label: string; amountAed: number };
export type QuoteResult = { lines: QuoteLine[]; totalAed: number };

export function computeQuote(input: QuoteInput): QuoteResult {
  const t = Math.max(1, Math.floor(input.travellers || 1));
  const nights = Math.max(1, Math.floor(input.nights || 1));
  const rooms = Math.ceil(t / 2);
  const lines: QuoteLine[] = [];

  if (input.services.flight) {
    lines.push({ key: "flight", label: `Flights (${t} traveller${t > 1 ? "s" : ""})`, amountAed: t * QUOTE_RATES.flightPerTraveller });
  }
  if (input.services.hotel) {
    const nightly = QUOTE_RATES.hotelNightly[input.hotelRating] ?? QUOTE_RATES.hotelNightly["4"];
    lines.push({ key: "hotel", label: `Hotel (${rooms} room${rooms > 1 ? "s" : ""} × ${nights} night${nights > 1 ? "s" : ""}, ${input.hotelRating}★)`, amountAed: rooms * nights * nightly });
  }
  if (input.services.visa) {
    lines.push({ key: "visa", label: `Visa service (${t} applicant${t > 1 ? "s" : ""})`, amountAed: t * QUOTE_RATES.visaPerApplicant });
  }
  if (input.services.tour) {
    const per = QUOTE_RATES.tourPerTraveller[input.tourCategory] ?? 200;
    const label = TOUR_OPTIONS.find((o) => o.value === input.tourCategory)?.label ?? "UAE tour";
    lines.push({ key: "tour", label: `${label} (${t} traveller${t > 1 ? "s" : ""})`, amountAed: t * per });
  }
  if (input.services.transfer) {
    lines.push({ key: "transfer", label: "Airport transfer", amountAed: QUOTE_RATES.transferFlat });
  }

  const totalAed = lines.reduce((sum, l) => sum + l.amountAed, 0);
  return { lines, totalAed };
}

export function formatMoney(amountAed: number, currency: "AED" | "USD"): string {
  const value = currency === "USD" ? amountAed / AED_PER_USD : amountAed;
  return `${currency} ${Math.round(value).toLocaleString()}`;
}
