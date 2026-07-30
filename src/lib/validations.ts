import { z } from "zod";
import { BUDGET_RANGES, VISA_COUNTRIES, VISA_TYPES } from "./enquiry-options";

/**
 * Zod schemas for the enquiry forms. Shared by the client forms (optional
 * inline checks) and enforced authoritatively in the API route handlers.
 */

const phone = z
  .string()
  .trim()
  .min(6, "Please enter a valid contact number.")
  .max(30);

export const visaEnquirySchema = z.object({
  country: z.enum(VISA_COUNTRIES),
  visaType: z.enum(VISA_TYPES),
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  phone,
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type VisaEnquiryInput = z.infer<typeof visaEnquirySchema>;

export const tourEnquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  phone,
  destination: z.string().trim().max(200).optional().or(z.literal("")),
  travellers: z.coerce.number().int().min(1).max(100).optional(),
  travelDates: z.string().trim().max(120).optional().or(z.literal("")),
  budgetRange: z.enum(BUDGET_RANGES).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type TourEnquiryInput = z.infer<typeof tourEnquirySchema>;
