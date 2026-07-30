import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/services";
import { enquiryLink, whatsappLink } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.blurb };
}

const steps = [
  {
    title: "Tell us what you need",
    body: "Send an enquiry with your details and budget. It takes a minute.",
  },
  {
    title: "We plan it for you",
    body: "Our team confirms options, requirements, and pricing — and answers your questions.",
  },
  {
    title: "Confirm & travel",
    body: "Once you're happy, we book and confirm — with a reference number for your records.",
  },
];

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const isCatalogue = service.funnel === "catalogue";
  const catalogueHref =
    slug === "tour-excursion-packages"
      ? "/tours"
      : slug === "transportation-transfers"
        ? "/transport"
        : "/#services";

  return (
    <>
      <PageHero eyebrow="Our services" title={service.title} subtitle={service.blurb} />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            {/* How it works */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-brand-900">
                How it works
              </h2>
              <ol className="mt-8 space-y-8">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-gold-400">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-brand-900">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-brand-500">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTA card */}
            <aside className="h-fit rounded-2xl border border-brand-100 bg-sand-50 p-7">
              <h2 className="text-lg font-semibold text-brand-900">
                Ready to start?
              </h2>
              <p className="mt-2 text-sm leading-6 text-brand-500">
                {isCatalogue
                  ? "Browse the options, or send an enquiry and we'll tailor it to your trip."
                  : "Send an enquiry with your details and budget — we'll take it from there."}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href={enquiryLink(service.slug)}
                  className="inline-flex items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
                >
                  Start an enquiry
                </Link>

                {isCatalogue && (
                  <Link
                    href={catalogueHref}
                    className="inline-flex items-center justify-center rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
                  >
                    Browse options
                  </Link>
                )}

                {slug === "visa-assistance" && (
                  <Link
                    href="/visa-enquiry"
                    className="inline-flex items-center justify-center rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
                  >
                    UK / US / Schengen visa enquiry
                  </Link>
                )}

                <a
                  href={whatsappLink(
                    `Hello AGIL Travels, I'd like help with ${service.title}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
                >
                  Message us on WhatsApp
                </a>
              </div>
            </aside>
          </div>

          <p className="mt-14 text-xs text-brand-400">
            More detail on this service is on the way — final content will be
            confirmed with AGIL before launch.
          </p>
        </div>
      </section>
    </>
  );
}
