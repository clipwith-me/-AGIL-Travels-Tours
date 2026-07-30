import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaffAuthed } from "@/lib/staff-auth";
import { updateVisaStatus } from "@/lib/visa-db";
import { VISA_STATUSES } from "@/lib/visa";
import { sendEmail, visaStatusEmail } from "@/lib/email";

const bodySchema = z.object({ status: z.enum(VISA_STATUSES) });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Staff-only.
  if (!(await isStaffAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 422 });
  }

  try {
    const app = await updateVisaStatus(id, parsed.data.status);

    // Notify the applicant on any status change away from "submitted".
    if (parsed.data.status !== "submitted") {
      void sendEmail({
        to: app.email,
        ...visaStatusEmail(app.full_name, app.reference, parsed.data.status),
      });
    }

    return NextResponse.json({ ok: true, status: parsed.data.status });
  } catch (err) {
    console.error("visa status update failed:", err);
    return NextResponse.json({ error: "Could not update status." }, { status: 500 });
  }
}
