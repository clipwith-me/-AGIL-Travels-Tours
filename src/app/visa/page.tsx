import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { VisaCountrySelect } from "@/components/visa/VisaCountrySelect";

export const metadata: Metadata = {
  title: "Visa Assistance",
  description:
    "Apply for a UAE visa online, or enquire about a visa for any other country. AGIL Travels guides you through the requirements from start to finish.",
};

export default function VisaPage() {
  return (
    <>
      <PageHero
        eyebrow="Visa Assistance"
        title="Where would you like to go?"
        subtitle="Select your destination to get started. UAE visas can be applied for fully online; for other countries we'll take your details and guide you through what's needed."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <VisaCountrySelect />
          </div>
        </div>
      </section>
    </>
  );
}
