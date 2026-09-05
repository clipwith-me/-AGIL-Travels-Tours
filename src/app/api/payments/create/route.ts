import { NextResponse } from "next/server";
import { createPaymentSchema } from "@/lib/validations";
import {
  createPaymentRecord,
  makePaymentReference,
  setPaymentProviderRef,
} from "@/lib/payments/db";
import { createStripeCheckout, isStripeConfigured } from "@/lib/payments/stripe";
import { createZiinaPayment, isZiinaConfigured } from "@/lib/payments/ziina";
import { createTabbyCheckout, isTabbyConfigured } from "@/lib/payments/tabby";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { CreatePaymentInput } from "@/lib/payments/types";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Payments aren't available yet. Please try again shortly." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = createPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the payment details.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const { provider, amount, currency, description, customerEmail, customerName, customerPhone } =
    parsed.data;

  // Provider readiness
  if (provider === "stripe" && !isStripeConfigured()) {
    return NextResponse.json({ error: "Card payments aren't set up yet." }, { status: 503 });
  }
  if (provider === "ziina" && !isZiinaConfigured()) {
    return NextResponse.json({ error: "Ziina isn't set up yet." }, { status: 503 });
  }
  if (provider === "tabby" && !isTabbyConfigured()) {
    return NextResponse.json({ error: "Tabby isn't set up yet." }, { status: 503 });
  }
  // Ziina and Tabby only process AED.
  if ((provider === "ziina" || provider === "tabby") && currency !== "aed") {
    return NextResponse.json(
      { error: `${provider === "tabby" ? "Tabby" : "Ziina"} payments must be in AED.` },
      { status: 400 },
    );
  }
  // Tabby needs buyer details for risk scoring.
  if (provider === "tabby" && (!customerName || !customerEmail || !customerPhone)) {
    return NextResponse.json(
      { error: "Tabby requires your name, email, and phone number." },
      { status: 400 },
    );
  }

  const reference = makePaymentReference();
  const input: CreatePaymentInput = {
    provider,
    amount,
    currency,
    description,
    customerEmail: customerEmail || undefined,
    customerName: customerName || undefined,
    customerPhone: customerPhone || undefined,
    reference,
  };

  // Prefer the configured canonical site URL (reliable on Vercel) over the
  // request origin, which can be an internal host behind the platform proxy.
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const urls = {
    successUrl: `${origin}/checkout/success`,
    cancelUrl: `${origin}/checkout/cancel`,
  };

  try {
    await createPaymentRecord(input);
    const result =
      provider === "stripe"
        ? await createStripeCheckout(input, urls)
        : provider === "tabby"
          ? await createTabbyCheckout(input, urls)
          : await createZiinaPayment(input, urls);

    await setPaymentProviderRef(reference, result.providerRef);
    return NextResponse.json({ url: result.url, reference }, { status: 201 });
  } catch (err) {
    console.error("payment create failed:", err);
    return NextResponse.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }
}
