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

export const createPaymentSchema = z.object({
  provider: z.enum(["stripe", "ziina"]),
  // Minor units (cents / fils). Guard against absurd values.
  amount: z.coerce.number().int().min(1).max(100_000_000),
  currency: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z]{3}$/, "Currency must be a 3-letter code."),
  description: z.string().trim().min(1).max(300),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
});

export type CreatePaymentBody = z.infer<typeof createPaymentSchema>;

const DOC_TYPES = [
  "passport_data_page",
  "passport_photo",
  "flight_ticket",
  "proof_of_accommodation",
  "bank_statement",
  "other",
] as const;

export const visaApplicationSchema = z.object({
  visaType: z.enum(["96hrs", "30-day", "60-day"]),
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(6, "Please enter a valid contact number.").max(30),
  nationality: z.string().trim().max(80).optional().or(z.literal("")),
  passportNumber: z.string().trim().max(40).optional().or(z.literal("")),
  dateOfBirth: z.string().trim().max(20).optional().or(z.literal("")),
  travelDate: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  documents: z
    .array(
      z.object({
        docType: z.enum(DOC_TYPES),
        fileName: z.string().trim().min(1).max(200),
      }),
    )
    .min(1, "At least one document is required.")
    .max(12),
});

export type VisaApplicationInput = z.infer<typeof visaApplicationSchema>;
