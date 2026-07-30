import { NextResponse } from "next/server";
import { visaApplicationSchema } from "@/lib/validations";
import { createVisaApplication } from "@/lib/visa-db";
import { getVisaType } from "@/lib/visa";
import { isSupabaseConfigured } from "@/lib/supabase";
import { sendEmail, visaSubmittedEmail } from "@/lib/email";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Applications aren't available yet. Please try again shortly." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = visaApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Ensure all required documents for this visa type are present.
  const visaType = getVisaType(parsed.data.visaType);
  if (!visaType) {
    return NextResponse.json({ error: "Unknown visa type." }, { status: 422 });
  }
  const submitted = new Set(parsed.data.documents.map((d) => d.docType));
  const missing = visaType.documents.filter((d) => !submitted.has(d.type));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required documents: ${missing.map((m) => m.label).join(", ")}.` },
      { status: 422 },
    );
  }

  try {
    const result = await createVisaApplication(parsed.data);

    // Fire-and-forget confirmation email (no-op until email is configured).
    void sendEmail({
      to: parsed.data.email,
      ...visaSubmittedEmail(parsed.data.fullName, result.reference, visaType.name),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("visa application create failed:", err);
    return NextResponse.json(
      { error: "Could not submit your application. Please try again." },
      { status: 500 },
    );
  }
}
