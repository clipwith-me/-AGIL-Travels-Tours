"use client";

import { useState } from "react";
import type { PaymentProvider } from "@/lib/payments/types";

const labelClass = "block text-sm font-medium text-brand-800";
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const PROVIDERS: { id: PaymentProvider; label: string }[] = [
  { id: "stripe", label: "Card (Stripe)" },
  { id: "ziina", label: "Ziina" },
  { id: "tabby", label: "Tabby (Pay in 4)" },
];

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aedOnly = provider === "ziina" || provider === "tabby";
  const tabby = provider === "tabby";

  function onProviderChange(next: PaymentProvider) {
    setProvider(next);
    if (next === "ziina" || next === "tabby") setCurrency("aed");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const major = Number(amount);
    if (!Number.isFinite(major) || major <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (tabby && (!name.trim() || !email.trim() || !phone.trim())) {
      setError("Tabby needs your name, email, and phone.");
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
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not start the payment.");
        return;
      }
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
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onProviderChange(p.id)}
              className={`rounded-lg border px-3 py-3 text-xs font-semibold transition-colors ${
                provider === p.id
                  ? "border-brand-600 bg-brand-50 text-brand-900"
                  : "border-brand-200 text-brand-600 hover:bg-brand-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="amount" className={labelClass}>Amount</label>
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
          <label htmlFor="currency" className={labelClass}>Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={aedOnly}
            className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-brand-50`}
          >
            <option value="usd">USD</option>
            <option value="aed">AED</option>
          </select>
          {aedOnly && (
            <p className="mt-1 text-xs text-brand-400">
              {tabby ? "Tabby" : "Ziina"} processes in AED only.
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Full name {tabby ? <span className="text-gold-600">*</span> : <span className="text-brand-400">(optional)</span>}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
          placeholder="Jane Smith"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email {tabby ? <span className="text-gold-600">*</span> : <span className="text-brand-400">(optional)</span>}
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
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone {tabby ? <span className="text-gold-600">*</span> : <span className="text-brand-400">(optional)</span>}
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            placeholder="+971 50 000 0000"
          />
        </div>
      </div>

      {tabby && (
        <p className="rounded-lg bg-sand-50 px-3 py-2 text-xs text-brand-500">
          Tabby is in sandbox mode. Use Tabby&apos;s test buyer details from their
          testing guidelines to simulate an approved payment.
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">{error}</p>
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
