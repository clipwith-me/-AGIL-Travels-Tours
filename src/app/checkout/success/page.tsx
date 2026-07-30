import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PaymentStatus } from "@/components/checkout/PaymentStatus";

export const metadata: Metadata = {
  title: "Payment confirmation",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <>
      <PageHero title="Payment confirmation" />
      <section className="bg-white">
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
            {ref ? (
              <PaymentStatus reference={ref} />
            ) : (
              <div className="text-center">
                <p className="text-sm text-brand-500">
                  No payment reference was provided.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-brand-950 hover:bg-gold-400"
                >
                  Back to home
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
