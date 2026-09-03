import "server-only";
import type { CreatePaymentInput, CreatePaymentResult, PaymentStatus } from "./types";

/**
 * Tabby "Pay in 4" (UAE BNPL) integration.
 *
 * Flow: create a checkout session (public key) → redirect the buyer to the
 * returned web_url → on return, retrieve the payment (secret key); if it's
 * AUTHORIZED, capture it so the funds are taken (→ CLOSED = paid).
 *
 * NOTE: SANDBOX only until Tabby's team approves production keys. Verify field
 * shapes against https://docs.tabby.ai/pay-in-4-custom-integration during their
 * review. Tabby requires buyer name/email/phone for risk scoring, and processes
 * in AED (for the UAE merchant). Amount is a decimal string in MAJOR units.
 */
const TABBY_BASE = process.env.TABBY_API_BASE ?? "https://api.tabby.ai";

export function isTabbyConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY &&
      process.env.TABBY_SECRET_KEY &&
      process.env.TABBY_MERCHANT_CODE,
  );
}

function major(amountMinor: number): string {
  return (amountMinor / 100).toFixed(2);
}

export async function createTabbyCheckout(
  input: CreatePaymentInput,
  urls: { successUrl: string; cancelUrl: string },
): Promise<CreatePaymentResult> {
  const publicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY!;
  const merchantCode = process.env.TABBY_MERCHANT_CODE!;
  const amount = major(input.amount);
  const successWithRef = `${urls.successUrl}?ref=${encodeURIComponent(input.reference)}`;
  const cancelWithRef = `${urls.cancelUrl}?ref=${encodeURIComponent(input.reference)}`;

  const res = await fetch(`${TABBY_BASE}/api/v2/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${publicKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant_code: merchantCode,
      lang: "en",
      merchant_urls: {
        success: successWithRef,
        cancel: cancelWithRef,
        failure: cancelWithRef,
      },
      payment: {
        amount,
        currency: "AED",
        description: input.description,
        buyer: {
          email: input.customerEmail ?? "",
          phone: input.customerPhone ?? "",
          name: input.customerName ?? "",
        },
        order: {
          reference_id: input.reference,
          items: [
            {
              title: input.description,
              quantity: 1,
              unit_price: amount,
              category: "Travel",
            },
          ],
        },
      },
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? `Tabby error (${res.status}).`);
  }

  // Pre-scoring can reject the buyer for this order → no installment product.
  const webUrl =
    data?.configuration?.available_products?.installments?.[0]?.web_url;
  const paymentId = data?.payment?.id as string | undefined;
  if (!webUrl || !paymentId) {
    throw new Error(
      "Tabby isn't available for this order. Please use another payment method.",
    );
  }

  return { url: webUrl as string, providerRef: paymentId };
}

function mapTabbyStatus(status: string): PaymentStatus {
  switch (status) {
    case "CLOSED":
      return "paid";
    case "REJECTED":
    case "EXPIRED":
      return "failed";
    default:
      return "pending"; // CREATED / AUTHORIZED (pre-capture)
  }
}

/**
 * On return from Tabby: fetch the payment; if AUTHORIZED, capture the full
 * amount so it settles (→ CLOSED). Returns the resulting internal status.
 */
export async function finalizeTabbyPayment(
  paymentId: string,
  amountMinor: number,
): Promise<PaymentStatus> {
  const secret = process.env.TABBY_SECRET_KEY!;
  const authHeaders = { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" };

  const res = await fetch(`${TABBY_BASE}/api/v2/payments/${paymentId}`, {
    headers: authHeaders,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `Tabby error (${res.status}).`);

  if (data?.status === "AUTHORIZED") {
    const cap = await fetch(`${TABBY_BASE}/api/v1/payments/${paymentId}/captures`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ amount: major(amountMinor) }),
    });
    const capData = await cap.json().catch(() => ({}));
    if (!cap.ok) throw new Error(capData?.error ?? `Tabby capture failed (${cap.status}).`);
    return mapTabbyStatus(capData?.status ?? "AUTHORIZED");
  }

  return mapTabbyStatus(String(data?.status ?? ""));
}
