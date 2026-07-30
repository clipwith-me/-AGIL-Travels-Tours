import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/staff-api";
import { createStaffUser } from "@/lib/staff-admin";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  fullName: z.string().trim().max(120).optional().default(""),
  role: z.enum(["admin", "staff"]).default("staff"),
  canManage: z.boolean().default(false),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 422 },
    );
  }

  try {
    await createStaffUser({
      email: parsed.data.email,
      password: parsed.data.password,
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      canManage: parsed.data.canManage,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("create staff user failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create user." },
      { status: 500 },
    );
  }
}
