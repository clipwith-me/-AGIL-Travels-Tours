import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/staff-api";
import { updateStaffUser } from "@/lib/staff-admin";

const schema = z.object({
  role: z.enum(["admin", "staff"]).optional(),
  canManage: z.boolean().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 422 });
  }

  try {
    await updateStaffUser(id, {
      role: parsed.data.role,
      canManage: parsed.data.canManage,
      active: parsed.data.active,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("update staff user failed:", err);
    return NextResponse.json({ error: "Could not update user." }, { status: 500 });
  }
}
