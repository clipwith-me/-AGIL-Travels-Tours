import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { enquiryLink, site } from "@/lib/site";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "About us",
  description:
    "AGIL Travels and Tours is a UAE travel agency built around one promise: your safety is our first priority.",
};

const values = [
  {
    title: "Safety first",
    body: "It's our tagline and our operating principle — vetted partners, verified bookings, and clear communication at every step.",
  },
  {
    title: "One team, end to end",
    body: "Visa, flights, hotels, transfers, and tours handled by a single point of contact, so nothing falls through the cracks.",
  },
  {
    title: "Honest and clear",
    body: "Real confirmations, real reference numbers, and straight answers — no doing-nothing buttons or payments that lead nowhere.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About AGIL Travels and Tours"
        subtitle={site.tagline}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="prose-none space-y-5 text-base leading-7 text-brand-600">
            <p>
              {site.name} is a UAE-focused travel agency helping travellers from
              around the world plan safe, well-organised trips to the Emirates.
              From your visa through to your final excursion, we handle the moving
              parts so you can focus on the journey.
            </p>
            <p>
              We bring together the full trip under one roof — visa assistance,
              flight bookings, hotel reservations, transfers, tours, and expert
              travel consultation — with local UAE knowledge behind every
              recommendation.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title}>
                <h2 className="text-base font-semibold text-brand-900">{v.title}</h2>
                <p className="mt-2 text-sm leading-6 text-brand-500">{v.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-brand-100 pt-10">
            <h2 className="text-xl font-bold tracking-tight text-brand-900">
              What we help with
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900"
                  >
                    <span className="text-gold-500" aria-hidden>
                      →
                    </span>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 rounded-2xl bg-sand-50 p-6 text-center sm:p-8">
            <p className="text-lg font-semibold text-brand-900">
              Ready to plan your trip?
            </p>
            <p className="mt-2 text-sm text-brand-500">
              Tell us what you need and we&apos;ll take it from there.
            </p>
            <Link
              href={enquiryLink()}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
            >
              Make an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
