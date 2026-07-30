import "server-only";
import { NextResponse } from "next/server";
import { getCurrentStaff } from "./staff";

/**
 * API guards: return a NextResponse error when unauthorized (routes can't
 * redirect), or null when the request may proceed.
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const session = await getCurrentStaff();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (session.profile.role !== "admin") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  return null;
}
