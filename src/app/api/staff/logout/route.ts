import { NextResponse } from "next/server";
import { staffCookieName } from "@/lib/staff-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(staffCookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
