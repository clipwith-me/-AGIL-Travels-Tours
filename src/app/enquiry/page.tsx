import type { Metadata } from "next";
import { services } from "@/lib/services";
import { PageHero } from "@/components/layout/PageHero";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";

export const metadata: Metadata = {
  title: "Make an enquiry",
  description:
    "Tell AGIL Travels what you need — visa, flights, hotels, transfers, tours, or consultation — and we'll get straight back to you on WhatsApp.",
};

export default async function EnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const initialService =
    service && services.some((s) => s.slug === service) ? service : "general";

  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        title="Make an enquiry"
        subtitle="Tell us about your trip and your budget. We'll reply on WhatsApp and guide you through the next steps — no payment needed to enquire."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <EnquiryForm initialService={initialService} />
          </div>
        </div>
      </section>
    </>
  );
}
