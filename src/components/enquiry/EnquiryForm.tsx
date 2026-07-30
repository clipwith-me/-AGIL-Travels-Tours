"use client";

import { useState } from "react";
import { services } from "@/lib/services";
import { whatsappLink } from "@/lib/site";

const BUDGET_RANGES = [
  "Not sure yet",
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
] as const;

const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: "general", label: "General enquiry" },
];

const labelClass = "block text-sm font-medium text-brand-800";
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export function EnquiryForm({ initialService }: { initialService: string }) {
  const [service, setService] = useState(initialService);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [travellers, setTravellers] = useState("");
  const [dates, setDates] = useState("");
  const [budget, setBudget] = useState<string>(BUDGET_RANGES[0]);
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name so we know who we're helping.");
      return;
    }
    setError(null);

    const serviceLabel =
      serviceOptions.find((o) => o.value === service)?.label ?? "General enquiry";

    const lines = [
      "Hello AGIL Travels, I'd like to make an enquiry.",
      "",
      `Service: ${serviceLabel}`,
      `Name: ${name.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      travellers.trim() ? `Travellers: ${travellers.trim()}` : null,
      dates.trim() ? `Travel dates: ${dates.trim()}` : null,
      `Budget: ${budget}`,
      details.trim() ? `\nDetails:\n${details.trim()}` : null,
    ].filter((line): line is string => line !== null);

    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="service" className={labelClass}>
          What can we help with?
        </label>
        <select
          id="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={fieldClass}
        >
          {serviceOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name <span className="text-gold-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="e.g. Jane Smith"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-brand-400">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
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
          <label htmlFor="dates" className={labelClass}>
            Travel dates <span className="text-brand-400">(optional)</span>
          </label>
          <input
            id="dates"
            type="text"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            className={fieldClass}
            placeholder="e.g. mid-August, 5 nights"
          />
        </div>
      </div>

      <div>
        <label htmlFor="budget" className={labelClass}>
          Budget range (USD)
        </label>
        <select
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
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
        <label htmlFor="details" className={labelClass}>
          Anything else? <span className="text-brand-400">(optional)</span>
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          className={fieldClass}
          placeholder="Tell us about your trip, questions, or special requirements."
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-base font-semibold text-brand-950 transition-colors hover:bg-gold-400 sm:w-auto"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.34A10 10 0 1 0 12 2Zm5.4 14.14c-.23.65-1.35 1.24-1.86 1.28-.5.05-.97.24-3.27-.68-2.76-1.09-4.5-3.92-4.64-4.1-.13-.19-1.1-1.47-1.1-2.8 0-1.33.7-1.98.95-2.25a1 1 0 0 1 .72-.34h.52c.17 0 .4-.06.62.47.23.55.78 1.9.85 2.04.07.14.11.3.02.48-.09.19-.14.3-.27.47l-.4.46c-.13.13-.26.28-.11.54.14.26.64 1.05 1.37 1.7.94.84 1.73 1.1 1.99 1.23.26.13.4.11.55-.07.15-.17.63-.73.8-.98.16-.26.33-.21.55-.13.23.08 1.46.69 1.71.82.26.13.43.19.5.3.06.11.06.64-.17 1.29Z" />
        </svg>
        Send enquiry via WhatsApp
      </button>

      <p className="text-xs leading-5 text-brand-400">
        This opens WhatsApp with your details pre-filled — just press send. No
        account or payment needed to enquire.
      </p>
    </form>
  );
}
