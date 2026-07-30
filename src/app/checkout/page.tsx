import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CheckoutDemo } from "@/components/checkout/CheckoutDemo";

export const metadata: Metadata = {
  title: "Checkout (test)",
  description: "Payment test harness.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Payment"
        subtitle="Secure checkout powered by Stripe (cards) and Ziina (UAE)."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <CheckoutDemo />
          </div>
          <p className="mt-6 text-center text-xs text-brand-400">
            Test harness — the live booking pages will pass the real item and
            price here. No real charge is made in test mode.
          </p>
        </div>
      </section>
    </>
  );
}
