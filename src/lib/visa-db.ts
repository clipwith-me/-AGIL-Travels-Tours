import "server-only";
import { getSupabaseAdmin } from "./supabase";
import type { VisaApplicationInput } from "./validations";
import type { VisaStatus } from "./visa";

const BUCKET = "visa-documents";

export function makeVisaReference(): string {
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const time = Date.now().toString(36).toUpperCase();
  return `AGIL-UAE-${(time + rand).slice(-6)}`;
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

export type UploadTarget = { docType: string; path: string; token: string };

/**
 * Create an application + its document rows, and return a signed upload URL
 * token for each document so the browser can upload directly to Storage.
 */
export async function createVisaApplication(
  input: VisaApplicationInput,
): Promise<{ reference: string; applicationId: string; uploads: UploadTarget[] }> {
  const supabase = getSupabaseAdmin();
  const reference = makeVisaReference();

  const { data: app, error: appErr } = await supabase
    .from("visa_applications")
    .insert({
      reference,
      visa_type: input.visaType,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      nationality: input.nationality || null,
      passport_number: input.passportNumber || null,
      date_of_birth: input.dateOfBirth || null,
      travel_date: input.travelDate || null,
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (appErr || !app) throw new Error(appErr?.message ?? "Could not create application.");
  const applicationId = app.id as string;

  const uploads: UploadTarget[] = [];
  for (const doc of input.documents) {
    const path = `${applicationId}/${doc.docType}-${sanitize(doc.fileName)}`;
    const { data: signed, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);
    if (signErr || !signed) throw new Error(signErr?.message ?? "Could not prepare upload.");

    const { error: docErr } = await supabase.from("visa_documents").insert({
      application_id: applicationId,
      doc_type: doc.docType,
      storage_path: path,
      file_name: doc.fileName,
    });
    if (docErr) throw new Error(docErr.message);

    uploads.push({ docType: doc.docType, path, token: signed.token });
  }

  return { reference, applicationId, uploads };
}

export type ApplicationRow = {
  id: string;
  reference: string;
  visa_type: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string | null;
  passport_number: string | null;
  date_of_birth: string | null;
  travel_date: string | null;
  notes: string | null;
  status: VisaStatus;
  created_at: string;
};

export async function listVisaApplications(): Promise<ApplicationRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("visa_applications")
    .select(
      "id, reference, visa_type, full_name, email, phone, nationality, passport_number, date_of_birth, travel_date, notes, status, created_at",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ApplicationRow[];
}

export type DocumentWithUrl = {
  docType: string;
  fileName: string | null;
  url: string | null;
};

export async function getVisaApplication(
  id: string,
): Promise<{ application: ApplicationRow; documents: DocumentWithUrl[] } | null> {
  const supabase = getSupabaseAdmin();
  const { data: app, error } = await supabase
    .from("visa_applications")
    .select(
      "id, reference, visa_type, full_name, email, phone, nationality, passport_number, date_of_birth, travel_date, notes, status, created_at",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!app) return null;

  const { data: docs } = await supabase
    .from("visa_documents")
    .select("doc_type, storage_path, file_name")
    .eq("application_id", id);

  const documents: DocumentWithUrl[] = [];
  for (const d of docs ?? []) {
    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(d.storage_path as string, 60 * 10); // 10 min
    documents.push({
      docType: d.doc_type as string,
      fileName: (d.file_name as string) ?? null,
      url: signed?.signedUrl ?? null,
    });
  }

  return { application: app as ApplicationRow, documents };
}

export async function updateVisaStatus(id: string, status: VisaStatus) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("visa_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("reference, full_name, email")
    .single();
  if (error) throw new Error(error.message);
  return data as { reference: string; full_name: string; email: string };
}
