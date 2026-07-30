import Link from "next/link";
import { notFound } from "next/navigation";
import { getVisaApplication } from "@/lib/visa-db";
import { getVisaType } from "@/lib/visa";
import { StatusBadge } from "@/components/staff/StatusBadge";
import { StatusControls } from "@/components/staff/StatusControls";

export const dynamic = "force-dynamic";

const DOC_LABELS: Record<string, string> = {
  passport_data_page: "Passport data page",
  passport_photo: "Passport photo",
  flight_ticket: "Flight ticket",
  proof_of_accommodation: "Proof of accommodation",
  bank_statement: "Bank statement",
  other: "Other document",
};

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-brand-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-brand-900">{value || "—"}</dd>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getVisaApplication(id);
  if (!result) notFound();
  const { application: a, documents } = result;

  return (
    <div>
      <Link href="/staff" className="text-sm font-medium text-brand-600 hover:text-brand-900">
        ← All applications
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand-900">{a.reference}</h1>
          <p className="text-sm text-brand-500">
            {getVisaType(a.visa_type)?.name ?? a.visa_type} · submitted{" "}
            {new Date(a.created_at).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={a.status} />
      </div>

      {/* Applicant details */}
      <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="text-sm font-semibold text-brand-900">Applicant</h2>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Full name" value={a.full_name} />
          <Field label="Email" value={a.email} />
          <Field label="Phone" value={a.phone} />
          <Field label="Nationality" value={a.nationality} />
          <Field label="Passport number" value={a.passport_number} />
          <Field label="Date of birth" value={a.date_of_birth} />
          <Field label="Intended travel" value={a.travel_date} />
        </dl>
        {a.notes && (
          <div className="mt-5">
            <dt className="text-xs uppercase tracking-wide text-brand-400">Notes</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-sm text-brand-700">{a.notes}</dd>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="mt-5 rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="text-sm font-semibold text-brand-900">Documents</h2>
        {documents.length === 0 ? (
          <p className="mt-3 text-sm text-brand-500">No documents uploaded.</p>
        ) : (
          <ul className="mt-4 divide-y divide-brand-100">
            {documents.map((d, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-brand-900">
                    {DOC_LABELS[d.docType] ?? d.docType}
                  </p>
                  <p className="text-xs text-brand-500">{d.fileName ?? ""}</p>
                </div>
                {d.url ? (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full border border-brand-200 px-4 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    View / download
                  </a>
                ) : (
                  <span className="text-xs text-brand-400">Unavailable</span>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-brand-400">
          Document links are temporary (expire after ~10 minutes) for security.
        </p>
      </div>

      {/* Status controls */}
      <div className="mt-5 rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="text-sm font-semibold text-brand-900">Update status</h2>
        <div className="mt-4">
          <StatusControls applicationId={a.id} current={a.status} />
        </div>
      </div>
    </div>
  );
}
