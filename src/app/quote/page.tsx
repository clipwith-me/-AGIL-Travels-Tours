import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { QuoteCalculator } from "@/components/quote/QuoteCalculator";

export const metadata: Metadata = {
  title: "Get an instant quote",
  description:
    "Build your trip and get an instant budget estimate for flights, hotels, visas, and UAE tours — then request an exact quote from our team.",
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Instant quote"
        title="Get an instant quote"
        subtitle="Tell us what you need and see an indicative budget straight away. Then request an exact quote — our team confirms the final price and handles the booking."
      />

      <section className="bg-sand-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <QuoteCalculator />
        </div>
      </section>
    </>
  );
}
