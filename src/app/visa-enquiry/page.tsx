import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { VisaEnquiryForm } from "@/components/enquiry/VisaEnquiryForm";

export const metadata: Metadata = {
  title: "Visa enquiry",
  description:
    "Enquire about a UK, US, Schengen, Canada, or other-country visa. Tell us your details and our team will follow up to guide you.",
};

export default function VisaEnquiryPage() {
  return (
    <>
      <PageHero
        eyebrow="Visa enquiry"
        title="Visa enquiry"
        subtitle="For UK, US, Schengen, Canada and other destinations, share your details below and our team will follow up to guide you through the process. Applying for a UAE visa? That has its own dedicated application flow — ask us and we'll point you to it."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <VisaEnquiryForm />
          </div>

          {/* Contact info card (mirrors the reference form's footer info) */}
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
