"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS, type VisaStatus } from "@/lib/visa";

const actions: { status: VisaStatus; className: string }[] = [
  { status: "under_review", className: "bg-amber-500 hover:bg-amber-400 text-white" },
  { status: "approved", className: "bg-green-600 hover:bg-green-500 text-white" },
  { status: "declined", className: "bg-red-600 hover:bg-red-500 text-white" },
];

export function StatusControls({
  applicationId,
  current,
}: {
  applicationId: string;
  current: VisaStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<VisaStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(status: VisaStatus) {
    setBusy(status);
    setError(null);
    try {
      const res = await fetch(`/api/visa-applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Could not update status.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.status}
            onClick={() => setStatus(a.status)}
            disabled={busy !== null || current === a.status}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${a.className}`}
          >
            {busy === a.status ? "Saving…" : `Mark ${STATUS_LABELS[a.status].toLowerCase()}`}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-brand-400">
        Changing the status emails the applicant automatically (once email is configured).
      </p>
    </div>
  );
}
