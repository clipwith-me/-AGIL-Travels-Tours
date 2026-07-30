import { STATUS_LABELS, type VisaStatus } from "@/lib/visa";

const styles: Record<VisaStatus, string> = {
  submitted: "bg-brand-100 text-brand-700",
  under_review: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: VisaStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
