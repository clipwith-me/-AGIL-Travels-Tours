import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories } from "@/lib/faq";
import { enquiryLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about AGIL Travels — visas, flights, hotels, tours, and payments.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="Frequently asked questions"
        subtitle="Quick answers on visas, flights, hotels, tours, and payments. Can't find what you need? Start an enquiry and we'll help."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          {faqCategories.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="mb-12 scroll-mt-24">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-600">
                {cat.name}
              </h2>
              <div className="divide-y divide-brand-100 rounded-2xl border border-brand-100">
                {cat.items.map((item, i) => (
                  <details key={i} className="group px-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium text-brand-900 marker:content-none">
                      {item.q}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-brand-400 transition-transform group-open:rotate-180"
                        aria-hidden
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <p className="pb-4 text-sm leading-6 text-brand-500">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-sand-50 p-6 text-center">
            <p className="text-base font-medium text-brand-900">
              Still have a question?
            </p>
            <Link
              href={enquiryLink()}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
            >
              Start an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
