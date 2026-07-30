"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Result = {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
};

export function PaymentStatus({ reference }: { reference: string }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/payments/verify?ref=${encodeURIComponent(reference)}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (cancelled) return;
        if (!ok) setError(j?.error ?? "Could not verify your payment.");
        else setResult(j);
      })
      .catch(() => !cancelled && setError("Could not verify your payment."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (loading) {
    return <p className="text-sm text-brand-500">Confirming your payment…</p>;
  }
  if (error) {
    return <p className="text-sm font-medium text-red-600">{error}</p>;
  }
  if (!result) return null;

  const paid = result.status === "paid";
  const amountMajor = (result.amount / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });

  return (
    <div className="text-center">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
          paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        }`}
      >
        {paid ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 8v4M12 16h.01M12 3l9 16H3Z" />
          </svg>
        )}
      </div>

      <h2 className="mt-5 text-xl font-bold text-brand-900">
        {paid ? "Payment received" : "Payment pending"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-brand-500">
        {paid
          ? "Thank you — your payment was successful."
          : "We haven't confirmed your payment yet. If you completed it, it may take a moment."}
      </p>

      <dl className="mx-auto mt-6 max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-brand-400">Reference</dt>
          <dd className="font-semibold text-brand-900">{result.reference}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-brand-400">Amount</dt>
          <dd className="font-semibold text-brand-900">
            {result.currency.toUpperCase()} {amountMajor}
          </dd>
        </div>
      </dl>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
      >
        Back to home
      </Link>
    </div>
  );
}
