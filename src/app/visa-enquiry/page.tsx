import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { VisaEnquiryForm } from "@/components/enquiry/VisaEnquiryForm";

export const metadata: Metadata = {
  title: "Visa enquiry",
  description:
    "Enquire about a visa for any country. Tell us your details and our team will follow up to guide you through the requirements.",
};

export default async function VisaEnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const { country } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Visa enquiry"
        title={country ? `${country} visa enquiry` : "Visa enquiry"}
        subtitle="Share your details below and our team will follow up to guide you through the requirements. Applying for a UAE visa instead? It has its own dedicated online application."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <VisaEnquiryForm initialCountry={country ?? ""} />
          </div>

          <p className="mt-6 text-center text-sm text-brand-500">
            Applying for a UAE visa?{" "}
            <Link href="/uae-visa" className="font-semibold text-brand-700 hover:text-brand-900">
              Use the full UAE application
            </Link>
          </p>

          <div className="mt-8 rounded-2xl bg-sand-50 p-6 text-sm text-brand-500">
            <p className="font-semibold text-brand-900">Prefer to talk to us?</p>
            <p className="mt-2">
              Our team is happy to help by phone, email, or WhatsApp. Send an
              enquiry above and we&apos;ll be in touch.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
