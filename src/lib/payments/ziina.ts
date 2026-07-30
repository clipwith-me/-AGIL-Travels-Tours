import "server-only";
import type { CreatePaymentInput, CreatePaymentResult, PaymentStatus } from "./types";

// Base URL is env-overridable. Default is Ziina's public API base.
// VERIFY against current Ziina docs during the client's Ziina setup.
const ZIINA_BASE = process.env.ZIINA_API_BASE ?? "https://api-v2.ziina.com/api";

export function isZiinaConfigured(): boolean {
  return Boolean(process.env.ZIINA_API_KEY);
}

function authHeaders(): HeadersInit {
  const key = process.env.ZIINA_API_KEY;
  if (!key) throw new Error("ZIINA_API_KEY is not set.");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

/**
 * Create a Ziina payment intent. Ziina charges in AED only, amount in fils
 * (minor units). Pass `test:true` (default in non-prod) for test payments.
 */
export async function createZiinaPayment(
  input: CreatePaymentInput,
  urls: { successUrl: string; cancelUrl: string },
): Promise<CreatePaymentResult> {
  const res = await fetch(`${ZIINA_BASE}/payment_intent`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      amount: input.amount, // fils
      currency_code: "AED",
      message: input.description,
      success_url: `${urls.successUrl}?ref=${encodeURIComponent(input.reference)}`,
      cancel_url: `${urls.cancelUrl}?ref=${encodeURIComponent(input.reference)}`,
      test: process.env.ZIINA_TEST !== "false",
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message ?? `Ziina error (${res.status}).`);
  }
  if (!data?.redirect_url) throw new Error("Ziina did not return a redirect URL.");
  return { url: data.redirect_url as string, providerRef: (data.id as string) ?? "" };
}

/** Map Ziina's intent status to our internal status. */
export function mapZiinaStatus(ziinaStatus: string): PaymentStatus {
  switch (ziinaStatus) {
    case "completed":
      return "paid";
    case "failed":
      return "failed";
    default:
      return "pending";
  }
}

/** Fetch a Ziina payment intent and return our mapped status. */
export async function getZiinaStatus(intentId: string): Promise<PaymentStatus> {
  const res = await fetch(`${ZIINA_BASE}/payment_intent/${intentId}`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message ?? `Ziina error (${res.status}).`);
  return mapZiinaStatus(String(data?.status ?? ""));
}
