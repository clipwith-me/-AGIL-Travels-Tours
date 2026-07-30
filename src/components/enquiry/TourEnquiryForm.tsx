"use client";

import { useState } from "react";
import { BUDGET_RANGES } from "@/lib/enquiry-options";

const labelClass = "block text-sm font-medium text-brand-800";
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export function TourEnquiryForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [travellers, setTravellers] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [budgetRange, setBudgetRange] = useState<string>(BUDGET_RANGES[0]);
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2 || !email.trim() || phone.trim().length < 6) {
      setError("Please fill in your name, email, and contact number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tour-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          destination,
          travellers: travellers || undefined,
          travelDates,
          budgetRange,
          message,
        }),
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
          Thanks, {fullName.trim().split(" ")[0]}. We&apos;ll design an itinerary
          around what you&apos;ve told us and get back to you soon.
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
            Contact number <span className="text-gold-600">*</span>
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
        <label htmlFor="destination" className={labelClass}>
          Where would you like to go / what interests you?{" "}
          <span className="text-brand-400">(optional)</span>
        </label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={fieldClass}
          placeholder="e.g. Dubai + desert safari + a cruise"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="travellers" className={labelClass}>
            Number of travellers <span className="text-brand-400">(optional)</span>
          </label>
          <input
            id="travellers"
            type="number"
            min={1}
            value={travellers}
            onChange={(e) => setTravellers(e.target.value)}
            className={fieldClass}
            placeholder="2"
          />
        </div>
        <div>
          <label htmlFor="travelDates" className={labelClass}>
            Travel dates <span className="text-brand-400">(optional)</span>
          </label>
          <input
            id="travelDates"
            type="text"
            value={travelDates}
            onChange={(e) => setTravelDates(e.target.value)}
            className={fieldClass}
            placeholder="e.g. mid-August, 5 nights"
          />
        </div>
      </div>

      <div>
        <label htmlFor="budgetRange" className={labelClass}>
          Budget range (USD)
        </label>
        <select
          id="budgetRange"
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
          className={fieldClass}
        >
          {BUDGET_RANGES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Tell us more <span className="text-brand-400">(optional)</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className={fieldClass}
          placeholder="Occasion, must-sees, pace, dietary or accessibility needs — anything that helps us tailor it."
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
        {submitting ? "Sending…" : "Request my itinerary"}
      </button>

      <p className="text-xs leading-5 text-brand-400">
        We&apos;ll use your details only to plan and discuss your trip. No payment
        needed to enquire.
      </p>
    </form>
  );
}
