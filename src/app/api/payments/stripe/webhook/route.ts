import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { constructStripeEvent } from "@/lib/payments/stripe";
import { setPaymentStatus } from "@/lib/payments/db";

// Stripe needs the raw, unparsed body to verify the signature.
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = constructStripeEvent(payload, signature);
  } catch (err) {
    console.error("Stripe webhook signature check failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const reference = session.metadata?.reference ?? session.client_reference_id;
        if (reference) {
          const paid = session.payment_status === "paid";
          await setPaymentStatus(reference, paid ? "paid" : "pending");
        }
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const reference = session.metadata?.reference ?? session.client_reference_id;
        if (reference) await setPaymentStatus(reference, "cancelled");
        break;
      }
      default:
        // Ignore unhandled event types.
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handling failed:", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
