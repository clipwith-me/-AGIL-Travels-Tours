"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ENQUIRY_STATUSES, type EnquiryStatus, type EnquiryType } from "@/lib/enquiry-status";

const LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export function EnquiryStatusControl({
  type,
  id,
  current,
}: {
  type: EnquiryType;
  id: string;
  current: EnquiryStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<EnquiryStatus>(current);
  const [busy, setBusy] = useState(false);

  async function change(next: EnquiryStatus) {
    const prev = value;
    setValue(next);
    setBusy(true);
    try {
      const res = await fetch("/api/enquiries/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status: next }),
      });
      if (!res.ok) {
        setValue(prev);
      } else {
        router.refresh();
      }
    } catch {
      setValue(prev);
    } finally {
      setBusy(false);
    }
  }

  const color =
    value === "new"
      ? "border-amber-300 bg-amber-50 text-amber-800"
      : value === "contacted"
        ? "border-brand-300 bg-brand-50 text-brand-800"
        : "border-green-300 bg-green-50 text-green-800";

  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => change(e.target.value as EnquiryStatus)}
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold outline-none disabled:opacity-60 ${color}`}
    >
      {ENQUIRY_STATUSES.map((s) => (
        <option key={s} value={s}>
          {LABELS[s]}
        </option>
      ))}
    </select>
  );
}
