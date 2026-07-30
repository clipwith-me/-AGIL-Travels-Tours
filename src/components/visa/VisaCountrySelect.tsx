"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, UAE, isUAE } from "@/lib/countries";

export function VisaCountrySelect() {
  const router = useRouter();
  const [country, setCountry] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!country) return;
    if (isUAE(country)) {
      router.push("/uae-visa");
    } else {
      router.push(`/visa-enquiry?country=${encodeURIComponent(country)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-brand-800">
          Which country are you applying to visit?
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          required
        >
          <option value="" disabled>
            Select a country…
          </option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
              {c === UAE ? " — full application online" : ""}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-brand-500">
          UAE visas can be applied for fully online. For other countries, send us
          an enquiry and our team will guide you through the requirements.
        </p>
      </div>

      <button
        type="submit"
        disabled={!country}
        className="inline-flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-3.5 text-base font-semibold text-brand-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Continue
      </button>
    </form>
  );
}
