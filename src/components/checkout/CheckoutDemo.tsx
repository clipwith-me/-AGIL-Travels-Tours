"use client";

import { useState } from "react";
import type { PaymentProvider } from "@/lib/payments/types";

const labelClass = "block text-sm font-medium text-brand-800";
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

/**
 * Test harness for the payment flow. In production the booking pages will call
 * POST /api/payments/create directly with the real item + price; this page just
 * lets us exercise the flow end-to-end with an arbitrary amount.
 */
export function CheckoutDemo() {
  const [provider, setProvider] = useState<PaymentProvider>("stripe");
  const [amount, setAmount] = useState("55.00");
  const [currency, setCurrency] = useState("usd");
  const [description, setDescription] = useState("Test payment — Classic Desert Safari");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onProviderChange(next: PaymentProvider) {
    setProvider(next);
    if (next === "ziina") setCurrency("aed"); // Ziina is AED-only
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const major = Number(amount);
    if (!Number.isFinite(major) || major <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    const minor = Math.round(major * 100);

    setSubmitting(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          amount: minor,
          currency,
          description,
          customerEmail: email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not start the payment.");
        return;
      }
      // Redirect to the hosted checkout page.
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className={labelClass}>Payment method</label>
        <div className="mt-2 flex gap-3">
          {(["stripe", "ziina"] as PaymentProvider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onProviderChange(p)}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                provider === p
                  ? "border-brand-600 bg-brand-50 text-brand-900"
                  : "border-brand-200 text-brand-600 hover:bg-brand-50"
              }`}
            >
              {p === "stripe" ? "Card (Stripe)" : "Ziina"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="amount" className={labelClass}>
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="currency" className={labelClass}>
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={provider === "ziina"}
            className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-brand-50`}
          >
            <option value="usd">USD</option>
            <option value="aed">AED</option>
          </select>
          {provider === "ziina" && (
            <p className="mt-1 text-xs text-brand-400">Ziina processes in AED only.</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={fieldClass}
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

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-3.5 text-base font-semibold text-brand-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Starting…" : "Proceed to payment"}
      </button>
    </form>
  );
}
