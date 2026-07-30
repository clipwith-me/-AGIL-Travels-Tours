"use client";

import { useState } from "react";
import { VISA_TYPES } from "@/lib/enquiry-options";
import { COUNTRIES, UAE } from "@/lib/countries";

const labelClass = "block text-sm font-medium text-brand-800";
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

// UAE has its own full application portal, so it's not an enquiry option here.
const COUNTRY_OPTIONS = COUNTRIES.filter((c) => c !== UAE);

export function VisaEnquiryForm({ initialCountry = "" }: { initialCountry?: string }) {
  const [country, setCountry] = useState<string>(
    COUNTRY_OPTIONS.includes(initialCountry) ? initialCountry : "",
  );
  const [visaType, setVisaType] = useState<string>(VISA_TYPES[0]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!country) {
      setError("Please choose the country you're applying to.");
      return;
    }
    if (fullName.trim().length < 2 || !email.trim() || phone.trim().length < 6) {
      setError("Please fill in your name, email, and contact number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/visa-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, visaType, fullName, email, phone, nationality, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setReference(data.reference);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-brand-900">Enquiry received</h2>
        <p className="mt-2 text-sm leading-6 text-brand-500">
          Thanks, {fullName.trim().split(" ")[0]}. Our team will be in touch soon
          about your {country} visa enquiry.
        </p>
        <p className="mt-5 text-sm text-brand-500">Your reference number</p>
        <p className="mt-1 text-lg font-bold tracking-wide text-brand-900">
          {reference}
        </p>
        <p className="mt-4 text-xs text-brand-400">
          Keep this reference for any follow-up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className={labelClass}>
            Destination country <span className="text-gold-600">*</span>
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={fieldClass}
            required
          >
            <option value="" disabled>
              Select a country…
            </option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="visaType" className={labelClass}>
            Visa type <span className="text-gold-600">*</span>
          </label>
          <select
            id="visaType"
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
            className={fieldClass}
          >
            {VISA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="fullName" className={labelClass}>
          Full name <span className="text-gold-600">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={fieldClass}
          placeholder="e.g. Jane Smith"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-gold-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Mobile number <span className="text-gold-600">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            placeholder="+971 50 000 0000"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="nationality" className={labelClass}>
          Nationality <span className="text-gold-600">*</span>
        </label>
        <select
          id="nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className={fieldClass}
          required
        >
          <option value="" disabled>
            Select your nationality…
          </option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Anything else? <span className="text-brand-400">(optional)</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className={fieldClass}
          placeholder="Travel dates, questions, or any details that help us advise you."
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-3.5 text-base font-semibold text-brand-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Sending…" : "Apply now"}
      </button>

      <p className="text-xs leading-5 text-brand-400">
        We&apos;ll use your details only to respond to this enquiry. Our team
        follows up by phone, email, or WhatsApp.
      </p>
    </form>
  );
}
