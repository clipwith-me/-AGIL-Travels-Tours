import "server-only";
import { getSupabaseAdmin } from "./supabase";
import type {
  HotelEnquiryInput,
  TourEnquiryInput,
  VisaEnquiryInput,
} from "./validations";

/** Human-friendly reference, e.g. AGIL-V-8F3K2Q. */
function makeReference(prefix: "V" | "T" | "H"): string {
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const time = Date.now().toString(36).toUpperCase();
  return `AGIL-${prefix}-${(time + rand).slice(-6)}`;
}

export async function createVisaEnquiry(input: VisaEnquiryInput): Promise<string> {
  const supabase = getSupabaseAdmin();
  const reference = makeReference("V");

  const { error } = await supabase.from("visa_enquiries").insert({
    reference,
    country: input.country,
    visa_type: input.visaType,
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    nationality: input.nationality || null,
    message: input.message || null,
  });

  if (error) throw new Error(error.message);
  return reference;
}

export async function createHotelEnquiry(input: HotelEnquiryInput): Promise<string> {
  const supabase = getSupabaseAdmin();
  const reference = makeReference("H");

  const { error } = await supabase.from("hotel_enquiries").insert({
    reference,
    country: input.country,
    city: input.city,
    check_in: input.checkIn || null,
    check_out: input.checkOut || null,
    rooms: input.rooms ?? null,
    adults: input.adults ?? null,
    children: input.children ?? null,
    star_rating: input.starRating || null,
    hotel_name: input.hotelName || null,
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    notes: input.notes || null,
  });

  if (error) throw new Error(error.message);
  return reference;
}

export async function createTourEnquiry(input: TourEnquiryInput): Promise<string> {
  const supabase = getSupabaseAdmin();
  const reference = makeReference("T");

  const { error } = await supabase.from("tour_enquiries").insert({
    reference,
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    destination: input.destination || null,
    travellers: input.travellers ?? null,
    travel_dates: input.travelDates || null,
    budget_range: input.budgetRange || null,
    message: input.message || null,
  });

  if (error) throw new Error(error.message);
  return reference;
}
