import type { Metadata } from "next";
import Link from "next/link";
import { transportServices } from "@/lib/catalogue";
import { enquiryLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Transportation & Transfers",
  description:
    "Airport transfers, city tours, private car hire, and limousine service across the UAE.",
};

export default function TransportPage() {
  return (
    <>
      <PageHero
        eyebrow="Transportation & Transfers"
        title="Transportation & Transfers"
        subtitle="Safe, reliable ground transport throughout your stay — from the moment you land to every trip in between."
      />

      <section className="bg-sand-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {transportServices.map((svc) => (
              <article
                key={svc.slug}
                className="flex flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-brand-900">
                  {svc.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-brand-500">
                  {svc.description}
                </p>
                <Link
                  href={enquiryLink("transportation-transfers")}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
                >
                  Enquire about {svc.name.toLowerCase()}
                  <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-6">
            <p className="text-sm leading-6 text-brand-700">
              <span className="font-semibold">Pricing &amp; detail coming soon.</span>{" "}
              Per-service itineraries, FAQs, and pricing are being finalised.
              Enquire now and we&apos;ll arrange transport around your trip.
            </p>
            <Link
              href={enquiryLink("transportation-transfers")}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
            >
              Enquire about transport
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
