import "server-only";
import { getSupabaseAdmin } from "./supabase";
import type { EnquiryStatus, EnquiryType } from "./enquiry-status";

export { ENQUIRY_STATUSES } from "./enquiry-status";
export type { EnquiryStatus, EnquiryType } from "./enquiry-status";

const TABLE: Record<EnquiryType, string> = {
  visa: "visa_enquiries",
  tour: "tour_enquiries",
  hotel: "hotel_enquiries",
  quote: "quote_requests",
};

export type VisaEnquiryRow = {
  id: string;
  reference: string;
  country: string;
  visa_type: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string | null;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
};

export type TourEnquiryRow = {
  id: string;
  reference: string;
  full_name: string;
  email: string;
  phone: string;
  destination: string | null;
  travellers: number | null;
  travel_dates: string | null;
  budget_range: string | null;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
};

export type HotelEnquiryRow = {
  id: string;
  reference: string;
  country: string;
  city: string;
  check_in: string | null;
  check_out: string | null;
  rooms: number | null;
  adults: number | null;
  children: number | null;
  star_rating: string | null;
  hotel_name: string | null;
  full_name: string;
  email: string;
  phone: string;
  notes: string | null;
  status: EnquiryStatus;
  created_at: string;
};

async function listTable<T>(table: string): Promise<T[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}

export type QuoteRequestRow = {
  id: string;
  reference: string;
  full_name: string;
  email: string;
  phone: string;
  destination: string | null;
  travellers: number | null;
  nights: number | null;
  services: string[] | null;
  estimate_aed: number | null;
  currency: string | null;
  status: EnquiryStatus;
  created_at: string;
};

export const listVisaEnquiries = () => listTable<VisaEnquiryRow>(TABLE.visa);
export const listTourEnquiries = () => listTable<TourEnquiryRow>(TABLE.tour);
export const listHotelEnquiries = () => listTable<HotelEnquiryRow>(TABLE.hotel);
export const listQuoteRequests = () => listTable<QuoteRequestRow>(TABLE.quote);

export async function updateEnquiryStatus(
  type: EnquiryType,
  id: string,
  status: EnquiryStatus,
): Promise<void> {
  const table = TABLE[type];
  if (!table) throw new Error("Unknown enquiry type.");
  const admin = getSupabaseAdmin();
  const { error } = await admin.from(table).update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}
