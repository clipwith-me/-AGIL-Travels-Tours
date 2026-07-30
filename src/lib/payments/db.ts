import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { CreatePaymentInput, PaymentStatus } from "./types";

/** Human-friendly payment reference, e.g. AGIL-P-8F3K2Q. */
export function makePaymentReference(): string {
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const time = Date.now().toString(36).toUpperCase();
  return `AGIL-P-${(time + rand).slice(-6)}`;
}

export async function createPaymentRecord(input: CreatePaymentInput): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("payments").insert({
    reference: input.reference,
    provider: input.provider,
    amount: input.amount,
    currency: input.currency,
    description: input.description,
    customer_email: input.customerEmail ?? null,
    status: "pending",
  });
  if (error) throw new Error(error.message);
}

export async function setPaymentProviderRef(
  reference: string,
  providerRef: string,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase
    .from("payments")
    .update({ provider_ref: providerRef, updated_at: new Date().toISOString() })
    .eq("reference", reference);
}

export async function setPaymentStatus(
  reference: string,
  status: PaymentStatus,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("payments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("reference", reference);
  if (error) throw new Error(error.message);
}

export async function getPayment(reference: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("payments")
    .select("reference, provider, provider_ref, amount, currency, description, status")
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
