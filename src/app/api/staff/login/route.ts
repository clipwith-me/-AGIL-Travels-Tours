import { NextResponse } from "next/server";
import { checkPassword, isStaffConfigured, staffCookieName, staffTokenValue } from "@/lib/staff-auth";

export async function POST(request: Request) {
  if (!isStaffConfigured()) {
    return NextResponse.json(
      { error: "Staff access isn't configured." },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!checkPassword(body.password ?? "")) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(staffCookieName(), staffTokenValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
