import Link from "next/link";
import { listVisaApplications } from "@/lib/visa-db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getVisaType, STATUS_LABELS, type VisaStatus } from "@/lib/visa";
import { StatusBadge } from "@/components/staff/StatusBadge";

export const dynamic = "force-dynamic";

export default async function StaffDashboardPage() {
  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-brand-500">Database is not configured.</p>;
  }

  let apps;
  try {
    apps = await listVisaApplications();
  } catch (err) {
    console.error("dashboard load failed:", err);
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        <p className="font-semibold">Couldn&apos;t load applications.</p>
        <p className="mt-1">
          The visa tables may not be set up yet. Run{" "}
          <code className="rounded bg-amber-100 px-1">supabase/visa.sql</code> in
          Supabase, then reload.
        </p>
      </div>
    );
  }

  const counts = apps.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold text-brand-900">UAE visa applications</h1>
        <span className="text-sm text-brand-500">{apps.length} total</span>
      </div>

      {/* Status summary */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(["submitted", "under_review", "approved", "declined"] as VisaStatus[]).map((s) => (
          <span key={s} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-600 shadow-sm">
            {STATUS_LABELS[s]}: <strong className="text-brand-900">{counts[s] ?? 0}</strong>
          </span>
        ))}
      </div>

      {apps.length === 0 ? (
        <p className="mt-8 text-sm text-brand-500">No applications yet.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-100 bg-sand-50 text-xs uppercase tracking-wide text-brand-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Applicant</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Visa</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Submitted</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-sand-50">
                  <td className="px-4 py-3">
                    <Link href={`/staff/applications/${a.id}`} className="font-semibold text-brand-800 hover:text-brand-950">
                      {a.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-brand-900">{a.full_name}</div>
                    <div className="text-xs text-brand-500">{a.email}</div>
                  </td>
                  <td className="hidden px-4 py-3 text-brand-600 sm:table-cell">
                    {getVisaType(a.visa_type)?.name ?? a.visa_type}
                  </td>
                  <td className="hidden px-4 py-3 text-brand-500 md:table-cell">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
