export type PaymentProvider = "stripe" | "ziina";

export const PAYMENT_PROVIDERS: PaymentProvider[] = ["stripe", "ziina"];

export type CreatePaymentInput = {
  provider: PaymentProvider;
  /** Amount in MINOR units (cents / fils). */
  amount: number;
  /** ISO currency code, lowercase, e.g. "usd", "aed". Ziina requires "aed". */
  currency: string;
  description: string;
  customerEmail?: string;
  /** Our internal payment reference (AGIL-P-…). */
  reference: string;
};

export type CreatePaymentResult = {
  /** Hosted checkout URL to redirect the customer to. */
  url: string;
  /** Provider-side identifier (Stripe session id / Ziina intent id). */
  providerRef: string;
};

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";
