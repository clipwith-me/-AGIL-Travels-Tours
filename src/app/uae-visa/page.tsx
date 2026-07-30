import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { VisaApplicationForm } from "@/components/visa/VisaApplicationForm";

export const metadata: Metadata = {
  title: "Apply for a UAE visa",
  description:
    "Apply for a UAE 96-hour, 30-day, or 60-day visit visa. Upload your documents and track your application with a reference number.",
};

export default function UaeVisaPage() {
  return (
    <>
      <PageHero
        eyebrow="UAE visa application"
        title="Apply for a UAE visa"
        subtitle="Complete your application and upload the required documents. You'll get a reference number and an email confirmation, and we'll notify you as your status changes."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <VisaApplicationForm />
          </div>
          <p className="mt-6 text-center text-sm text-brand-500">
            Applying for a UK, US, Schengen, or other country visa instead?{" "}
            <Link href="/visa-enquiry" className="font-semibold text-brand-700 hover:text-brand-900">
              Use the visa enquiry form
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
