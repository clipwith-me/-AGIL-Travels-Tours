import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <>
      <PageHero title="Payment cancelled" />
      <section className="bg-white">
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-brand-900">
              Your payment was cancelled
            </h2>
            <p className="mt-2 text-sm leading-6 text-brand-500">
              No charge was made. You can try again whenever you&apos;re ready.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-brand-950 hover:bg-gold-400"
              >
                Try again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-50"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
