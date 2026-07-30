import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal shared-password gate for the staff dashboard. On login we set an
 * httpOnly cookie whose value is a hash of STAFF_PASSWORD; protected pages
 * recompute and compare. Adequate for a single-team dashboard; can be upgraded
 * to per-user auth later if the client needs multiple named accounts.
 */
const COOKIE = "agil_staff";

export function isStaffConfigured(): boolean {
  return Boolean(process.env.STAFF_PASSWORD);
}

function expectedToken(): string | null {
  const pw = process.env.STAFF_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update(`agil-staff::${pw}`).digest("hex");
}

export function checkPassword(password: string): boolean {
  const pw = process.env.STAFF_PASSWORD;
  return Boolean(pw && password === pw);
}

export function staffCookieName(): string {
  return COOKIE;
}

export function staffTokenValue(): string {
  const token = expectedToken();
  if (!token) throw new Error("STAFF_PASSWORD is not set.");
  return token;
}

export async function isStaffAuthed(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === token;
}
