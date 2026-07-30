import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { HotelEnquiryForm } from "@/components/enquiry/HotelEnquiryForm";

export const metadata: Metadata = {
  title: "Hotel & Apartment Rentals",
  description:
    "Tell us where and when you're staying and we'll find hotel or apartment options to match — then reply on WhatsApp or by email.",
};

export default function HotelsPage() {
  return (
    <>
      <PageHero
        eyebrow="Hotel & Apartment Rentals"
        title="Find your stay"
        subtitle="Tell us where and when you're travelling, and what you're looking for. Our team will find matching hotels or apartments and reply on WhatsApp or by email."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <HotelEnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
