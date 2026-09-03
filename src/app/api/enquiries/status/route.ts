import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentStaff } from "@/lib/staff";
import {
  ENQUIRY_STATUSES,
  updateEnquiryStatus,
} from "@/lib/enquiries-admin";

const schema = z.object({
  type: z.enum(["visa", "tour", "hotel", "quote"]),
  id: z.string().uuid(),
  status: z.enum(ENQUIRY_STATUSES),
});

export async function PATCH(request: Request) {
  const session = await getCurrentStaff();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

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
    await updateEnquiryStatus(parsed.data.type, parsed.data.id, parsed.data.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("enquiry status update failed:", err);
    return NextResponse.json({ error: "Could not update status." }, { status: 500 });
  }
}
