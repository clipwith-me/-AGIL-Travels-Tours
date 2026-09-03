export type PaymentProvider = "stripe" | "ziina" | "tabby";

export const PAYMENT_PROVIDERS: PaymentProvider[] = ["stripe", "ziina", "tabby"];

export type CreatePaymentInput = {
  provider: PaymentProvider;
  /** Amount in MINOR units (cents / fils). */
  amount: number;
  /** ISO currency code, lowercase, e.g. "usd", "aed". Ziina + Tabby require "aed". */
  currency: string;
  description: string;
  customerEmail?: string;
  /** Buyer name — required by Tabby for risk scoring. */
  customerName?: string;
  /** Buyer phone — required by Tabby for risk scoring. */
  customerPhone?: string;
  /** Our internal payment reference (AGIL-P-…). */
  reference: string;
};

export type CreatePaymentResult = {
  /** Hosted checkout URL to redirect the customer to. */
  url: string;
  /** Provider-side identifier (Stripe session id / Ziina intent id / Tabby payment id). */
  providerRef: string;
};

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";
