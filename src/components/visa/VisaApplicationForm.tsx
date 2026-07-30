"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { VISA_TYPES, VISA_NOTE, type DocType } from "@/lib/visa";

const labelClass = "block text-sm font-medium text-brand-800";
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const MAX_MB = 10;

export function VisaApplicationForm() {
  const [visaTypeId, setVisaTypeId] = useState(VISA_TYPES[0].id);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<Partial<Record<DocType, File>>>({});

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const visaType = VISA_TYPES.find((v) => v.id === visaTypeId)!;

  function setFile(docType: DocType, file: File | undefined) {
    setFiles((prev) => {
      const next = { ...prev };
      if (file) next[docType] = file;
      else delete next[docType];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2 || !email.trim() || phone.trim().length < 6) {
      setError("Please fill in your name, email, and contact number.");
      return;
    }
    // All required docs present?
    const missing = visaType.documents.filter((d) => !files[d.type]);
    if (missing.length > 0) {
      setError(`Please upload: ${missing.map((m) => m.label).join(", ")}.`);
      return;
    }
    // Size check
    for (const d of visaType.documents) {
      const f = files[d.type]!;
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`${d.label} is too large (max ${MAX_MB}MB).`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const documents = visaType.documents.map((d) => ({
        docType: d.type,
        fileName: files[d.type]!.name,
      }));

      const res = await fetch("/api/visa-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visaType: visaTypeId,
          fullName,
          email,
          phone,
          nationality,
          passportNumber,
          dateOfBirth,
          travelDate,
          notes,
          documents,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not submit your application.");
        return;
      }

      // Upload each document to its signed URL.
      const supabase = getSupabaseBrowser();
      for (const up of data.uploads as { docType: DocType; path: string; token: string }[]) {
        const file = files[up.docType]!;
        const { error: upErr } = await supabase.storage
          .from("visa-documents")
          .uploadToSignedUrl(up.path, up.token, file);
        if (upErr) {
          setError(
            "Your application was created, but a document failed to upload. Please contact us with your reference.",
          );
          setReference(data.reference);
          return;
        }
      }

      setReference(data.reference);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-brand-900">Application received</h2>
        <p className="mt-2 text-sm leading-6 text-brand-500">
          Thanks, {fullName.trim().split(" ")[0]}. Your {visaType.name} application
          is now under review. We&apos;ve emailed a confirmation to {email.trim()}.
        </p>
        <p className="mt-5 text-sm text-brand-500">Your reference number</p>
        <p className="mt-1 text-lg font-bold tracking-wide text-brand-900">{reference}</p>
        <p className="mt-4 text-xs text-brand-400">
          Keep this reference — we&apos;ll email you when your status changes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Visa type */}
      <fieldset>
        <legend className="text-sm font-semibold text-brand-900">1. Choose your UAE visa</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {VISA_TYPES.map((v) => (
            <label
              key={v.id}
              className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                visaTypeId === v.id
                  ? "border-brand-600 bg-brand-50"
                  : "border-brand-200 hover:bg-brand-50"
              }`}
            >
              <input
                type="radio"
                name="visaType"
                value={v.id}
                checked={visaTypeId === v.id}
                onChange={() => setVisaTypeId(v.id)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold text-brand-900">{v.name}</span>
              <span className="mt-1 block text-xs leading-5 text-brand-500">{v.summary}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Applicant details */}
      <fieldset className="space-y-5">
        <legend className="text-sm font-semibold text-brand-900">2. Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className={labelClass}>Full name <span className="text-gold-600">*</span></label>
            <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass} placeholder="As on your passport" required />
          </div>
          <div>
            <label htmlFor="nationality" className={labelClass}>Nationality</label>
            <input id="nationality" type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email <span className="text-gold-600">*</span></label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Contact number <span className="text-gold-600">*</span></label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} placeholder="+971 50 000 0000" required />
          </div>
          <div>
            <label htmlFor="passport" className={labelClass}>Passport number</label>
            <input id="passport" type="text" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="dob" className={labelClass}>Date of birth</label>
            <input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="travel" className={labelClass}>Intended travel date</label>
            <input id="travel" type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className={fieldClass} />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className={labelClass}>Notes <span className="text-brand-400">(optional)</span></label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={fieldClass} placeholder="Anything we should know." />
        </div>
      </fieldset>

      {/* Documents */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-brand-900">
          3. Required documents for the {visaType.name}
        </legend>
        <p className="text-xs text-brand-400">
          Accepted: images or PDF, up to {MAX_MB}MB each. Uploaded securely.
        </p>
        {visaType.documents.map((d) => (
          <div key={d.type} className="rounded-xl border border-brand-100 p-4">
            <label htmlFor={`doc-${d.type}`} className="flex flex-col gap-1">
              <span className="text-sm font-medium text-brand-900">
                {d.label} <span className="text-gold-600">*</span>
              </span>
              {d.hint && <span className="text-xs text-brand-500">{d.hint}</span>}
            </label>
            <input
              id={`doc-${d.type}`}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(d.type, e.target.files?.[0])}
              className="mt-2 block w-full text-sm text-brand-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
            />
            {files[d.type] && (
              <p className="mt-2 text-xs text-green-700">Selected: {files[d.type]!.name}</p>
            )}
          </div>
        ))}
        <p className="text-xs leading-5 text-brand-400">{VISA_NOTE}</p>
      </fieldset>

      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-3.5 text-base font-semibold text-brand-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
