import { NextResponse } from "next/server";
import { getPayment, setPaymentStatus } from "@/lib/payments/db";
import { getZiinaStatus } from "@/lib/payments/ziina";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * GET /api/payments/verify?ref=AGIL-P-XXXXXX
 * Returns the current status of a payment. For Ziina it re-checks the intent
 * with Ziina (source of truth on return); for Stripe it returns the stored
 * status, which the webhook keeps authoritative.
 */
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Unavailable." }, { status: 503 });
  }

  const reference = new URL(request.url).searchParams.get("ref");
  if (!reference) {
    return NextResponse.json({ error: "Missing ref." }, { status: 400 });
  }

  try {
    const payment = await getPayment(reference);
    if (!payment) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    let status = payment.status;
    if (payment.provider === "ziina" && payment.provider_ref && status === "pending") {
      status = await getZiinaStatus(payment.provider_ref);
      if (status !== payment.status) await setPaymentStatus(reference, status);
    }

    return NextResponse.json({
      reference: payment.reference,
      status,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
    });
  } catch (err) {
    console.error("payment verify failed:", err);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
