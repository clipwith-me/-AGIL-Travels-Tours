"use client";

import { useState } from "react";
import { COUNTRIES } from "@/lib/countries";

const labelClass = "block text-sm font-medium text-brand-800";
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const STAR_OPTIONS = ["Any", "3-star", "4-star", "5-star"];

export function HotelEnquiryForm() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState("1");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [starRating, setStarRating] = useState("Any");
  const [hotelName, setHotelName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!country || !city.trim()) {
      setError("Please choose a country and city.");
      return;
    }
    if (fullName.trim().length < 2 || !email.trim() || phone.trim().length < 6) {
      setError("Please fill in your name, email, and contact number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/hotel-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          city,
          checkIn,
          checkOut,
          rooms,
          adults,
          children,
          starRating,
          hotelName,
          fullName,
          email,
          phone,
          notes,
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
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-brand-900">Enquiry received</h2>
        <p className="mt-2 text-sm leading-6 text-brand-500">
          Thanks, {fullName.trim().split(" ")[0]}. We&apos;ll find options for your
          stay in {city} and get back to you by WhatsApp or email.
        </p>
        <p className="mt-5 text-sm text-brand-500">Your reference number</p>
        <p className="mt-1 text-lg font-bold tracking-wide text-brand-900">{reference}</p>
        <p className="mt-4 text-xs text-brand-400">Keep this reference for any follow-up.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className={labelClass}>Country <span className="text-gold-600">*</span></label>
          <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClass} required>
            <option value="" disabled>Select a country…</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>City <span className="text-gold-600">*</span></label>
          <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass} placeholder="e.g. Dubai" required />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="checkIn" className={labelClass}>Check-in</label>
          <input id="checkIn" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="checkOut" className={labelClass}>Check-out</label>
          <input id="checkOut" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={fieldClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="rooms" className={labelClass}>Rooms</label>
          <input id="rooms" type="number" min={1} value={rooms} onChange={(e) => setRooms(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="adults" className={labelClass}>Adults</label>
          <input id="adults" type="number" min={1} value={adults} onChange={(e) => setAdults(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="children" className={labelClass}>Children</label>
          <input id="children" type="number" min={0} value={children} onChange={(e) => setChildren(e.target.value)} className={fieldClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="starRating" className={labelClass}>Preferred rating <span className="text-brand-400">(optional)</span></label>
          <select id="starRating" value={starRating} onChange={(e) => setStarRating(e.target.value)} className={fieldClass}>
            {STAR_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="hotelName" className={labelClass}>Specific hotel? <span className="text-brand-400">(optional)</span></label>
          <input id="hotelName" type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} className={fieldClass} placeholder="Hotel or apartment name" />
        </div>
      </div>

      <div className="border-t border-brand-100 pt-5">
        <p className="text-sm font-semibold text-brand-900">Your contact details</p>
        <div className="mt-3 space-y-5">
          <div>
            <label htmlFor="fullName" className={labelClass}>Full name <span className="text-gold-600">*</span></label>
            <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass} placeholder="e.g. Jane Smith" required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={labelClass}>Email <span className="text-gold-600">*</span></label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Mobile number <span className="text-gold-600">*</span></label>
              <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} placeholder="+971 50 000 0000" required />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>Anything else? <span className="text-brand-400">(optional)</span></label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={fieldClass} placeholder="Budget, location preferences, special requirements." />
      </div>

      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-3.5 text-base font-semibold text-brand-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send enquiry"}
      </button>
      <p className="text-xs leading-5 text-brand-400">
        We&apos;ll reply by WhatsApp or email with options for your stay. No payment needed to enquire.
      </p>
    </form>
  );
}
