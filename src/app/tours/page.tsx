import type { Metadata } from "next";
import Link from "next/link";
import { tourCategories } from "@/lib/catalogue";
import { enquiryLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Tours & Excursions",
  description:
    "Explore AGIL's UAE tour categories — desert safaris, landmarks, theme parks, cruises, adventure, and nature & wildlife.",
};

export default function ToursPage() {
  return (
    <>
      <PageHero
        eyebrow="Tours & Excursions"
        title="Tours & Excursion Packages"
        subtitle="Curated experiences across the UAE, organised into six categories. The full package list and pricing is being finalised — enquire and we'll share what's currently available for your dates."
      />

      <section className="bg-sand-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tourCategories.map((cat) => (
              <article
                key={cat.slug}
                className="flex flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-brand-900">
                  {cat.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-brand-500">
                  {cat.description}
                </p>
                <Link
                  href={enquiryLink("tour-excursion-packages")}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
                >
                  Enquire about {cat.name.toLowerCase()}
                  <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>

          {/* Content-pending notice */}
          <div className="mt-10 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-6">
            <p className="text-sm leading-6 text-brand-700">
              <span className="font-semibold">Full catalogue coming soon.</span>{" "}
              We&apos;re loading the complete list of tours with descriptions and
              pricing. In the meantime, start an enquiry and our team will send
              you current options and availability.
            </p>
            <Link
              href={enquiryLink("tour-excursion-packages")}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
            >
              Enquire about tours
            </Link>
          </div>

          {/* Custom itinerary */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-base font-semibold text-brand-900">
                Want something bespoke?
              </p>
              <p className="mt-1 text-sm text-brand-500">
                Tell us your ideas and we&apos;ll design a personalized itinerary
                around you.
              </p>
            </div>
            <Link
              href="/tour-enquiry"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-brand-300 px-5 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
            >
              Plan a custom tour
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
