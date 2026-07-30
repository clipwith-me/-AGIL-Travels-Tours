import "server-only";
import Stripe from "stripe";
import type { CreatePaymentInput, CreatePaymentResult } from "./types";

let stripe: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function getStripe(): Stripe {
  if (stripe) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  stripe = new Stripe(key);
  return stripe;
}

export async function createStripeCheckout(
  input: CreatePaymentInput,
  urls: { successUrl: string; cancelUrl: string },
): Promise<CreatePaymentResult> {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency,
          unit_amount: input.amount,
          product_data: { name: input.description },
        },
      },
    ],
    customer_email: input.customerEmail,
    client_reference_id: input.reference,
    metadata: { reference: input.reference },
    success_url: `${urls.successUrl}?ref=${encodeURIComponent(input.reference)}`,
    cancel_url: `${urls.cancelUrl}?ref=${encodeURIComponent(input.reference)}`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return { url: session.url, providerRef: session.id };
}

/**
 * Verify + parse a Stripe webhook event from the raw request body.
 * Throws if the signature is invalid.
 */
export function constructStripeEvent(payload: string, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  return getStripe().webhooks.constructEvent(payload, signature, secret);
}
