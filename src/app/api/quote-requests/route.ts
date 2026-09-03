import { NextResponse } from "next/server";
import { quoteRequestSchema } from "@/lib/validations";
import { createQuoteRequest } from "@/lib/enquiries";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Quotes aren't available yet. Please try again shortly." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const reference = await createQuoteRequest(parsed.data);
    return NextResponse.json({ reference }, { status: 201 });
  } catch (err) {
    console.error("quote request insert failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
