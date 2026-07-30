import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { TourEnquiryForm } from "@/components/enquiry/TourEnquiryForm";

export const metadata: Metadata = {
  title: "Plan a custom tour",
  description:
    "Want something beyond our set packages? Tell us your ideas, dates, and budget and we'll design a personalized UAE itinerary for you.",
};

export default function TourEnquiryPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom itineraries"
        title="Plan a custom tour"
        subtitle="Want something beyond our set packages? Tell us your ideas, dates, and budget, and we'll design a personalized UAE itinerary around you."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <TourEnquiryForm />
          </div>

          <p className="mt-8 text-center text-sm text-brand-500">
            Looking for our ready-made packages instead?{" "}
            <Link href="/tours" className="font-semibold text-brand-700 hover:text-brand-900">
              Browse tours &amp; excursions
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
