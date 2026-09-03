"use client";

import { useMemo, useState } from "react";
import {
  SERVICES,
  TOUR_OPTIONS,
  computeQuote,
  formatMoney,
  type HotelRating,
  type ServiceKey,
} from "@/lib/quote";

const labelClass = "block text-sm font-medium text-brand-800";
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export function QuoteCalculator() {
  const [services, setServices] = useState<Record<ServiceKey, boolean>>({
    flight: true,
    hotel: true,
    visa: false,
    tour: false,
    transfer: false,
  });
  const [travellers, setTravellers] = useState(2);
  const [nights, setNights] = useState(4);
  const [hotelRating, setHotelRating] = useState<HotelRating>("4");
  const [tourCategory, setTourCategory] = useState(TOUR_OPTIONS[0].value);
  const [destination, setDestination] = useState("");
  const [currency, setCurrency] = useState<"AED" | "USD">("AED");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const quote = useMemo(
    () => computeQuote({ travellers, nights, hotelRating, tourCategory, services }),
    [travellers, nights, hotelRating, tourCategory, services],
  );

  function toggle(key: ServiceKey) {
    setServices((s) => ({ ...s, [key]: !s[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2 || !email.trim() || phone.trim().length < 6) {
      setError("Please add your name, email, and phone so we can send your quote.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          destination,
          travellers,
          nights,
          services: (Object.keys(services) as ServiceKey[]).filter((k) => services[k]),
          hotelRating,
          tourCategory,
          estimateAed: quote.totalAed,
          currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setReference(data.reference);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-brand-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-brand-900">Quote request sent</h2>
        <p className="mt-2 text-sm leading-6 text-brand-500">
          Thanks, {name.trim().split(" ")[0]}. Your indicative estimate was{" "}
          <strong className="text-brand-900">{formatMoney(quote.totalAed, currency)}</strong>.
          Our team will confirm an exact price and get back to you shortly.
        </p>
        <p className="mt-5 text-sm text-brand-500">Your reference number</p>
        <p className="mt-1 text-lg font-bold tracking-wide text-brand-900">{reference}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Builder */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-900">Build your trip</h2>

        <div className="mt-4">
          <span className={labelClass}>What do you need?</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => toggle(s.key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  services[s.key]
                    ? "border-brand-600 bg-brand-50 text-brand-900"
                    : "border-brand-200 text-brand-600 hover:bg-brand-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="destination" className={labelClass}>Destination <span className="text-brand-400">(optional)</span></label>
            <input id="destination" type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className={fieldClass} placeholder="e.g. Dubai, London" />
          </div>
          <div>
            <label htmlFor="travellers" className={labelClass}>Travellers</label>
            <input id="travellers" type="number" min={1} value={travellers} onChange={(e) => setTravellers(Number(e.target.value))} className={fieldClass} />
          </div>
          {services.hotel && (
            <>
              <div>
                <label htmlFor="nights" className={labelClass}>Nights</label>
                <input id="nights" type="number" min={1} value={nights} onChange={(e) => setNights(Number(e.target.value))} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="rating" className={labelClass}>Hotel rating</label>
                <select id="rating" value={hotelRating} onChange={(e) => setHotelRating(e.target.value as HotelRating)} className={fieldClass}>
                  <option value="3">3-star</option>
                  <option value="4">4-star</option>
                  <option value="5">5-star</option>
                </select>
              </div>
            </>
          )}
          {services.tour && (
            <div className="sm:col-span-2">
              <label htmlFor="tour" className={labelClass}>UAE tour</label>
              <select id="tour" value={tourCategory} onChange={(e) => setTourCategory(e.target.value)} className={fieldClass}>
                {TOUR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Estimate + contact */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-900">Your estimate</h2>
          <div className="inline-flex overflow-hidden rounded-full border border-brand-200 text-xs font-semibold">
            {(["AED", "USD"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 ${currency === c ? "bg-brand-800 text-white" : "text-brand-600"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {quote.lines.length === 0 ? (
            <p className="text-sm text-brand-400">Select what you need to see an estimate.</p>
          ) : (
            quote.lines.map((l) => (
              <div key={l.key} className="flex justify-between gap-4 text-sm">
                <span className="text-brand-600">{l.label}</span>
                <span className="font-medium text-brand-900">{formatMoney(l.amountAed, currency)}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-brand-100 pt-4">
          <span className="text-sm font-semibold text-brand-900">Estimated from</span>
          <span className="text-2xl font-bold text-brand-900">{formatMoney(quote.totalAed, currency)}</span>
        </div>
        <p className="mt-1 text-xs text-brand-400">
          Indicative only — a firm quote follows from our team. Excludes government/embassy fees.
        </p>

        <div className="mt-5 space-y-4 border-t border-brand-100 pt-5">
          <div>
            <label htmlFor="name" className={labelClass}>Full name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} placeholder="Jane Smith" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="qemail" className={labelClass}>Email</label>
              <input id="qemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="qphone" className={labelClass}>Phone</label>
              <input id="qphone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} placeholder="+971 50 000 0000" />
            </div>
          </div>
        </div>

        {error && <p role="alert" className="mt-3 text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || quote.lines.length === 0}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-3.5 text-base font-semibold text-brand-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Get my exact quote"}
        </button>
      </form>
    </div>
  );
}
