import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import { LogoutButton } from "@/components/staff/LogoutButton";

export default async function StaffDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email, profile } = await requireStaff();

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="border-b border-brand-100 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-5">
            <Link href="/staff" className="text-sm font-bold text-brand-900">
              AGIL · Staff
            </Link>
            <Link
              href="/staff"
              className="text-sm font-medium text-brand-600 hover:text-brand-900"
            >
              Applications
            </Link>
            <Link
              href="/staff/enquiries"
              className="text-sm font-medium text-brand-600 hover:text-brand-900"
            >
              Enquiries
            </Link>
            {profile.role === "admin" && (
              <Link
                href="/staff/users"
                className="text-sm font-medium text-brand-600 hover:text-brand-900"
              >
                Users
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-brand-500 sm:inline">
              {email}
              <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 font-semibold text-brand-700">
                {profile.role === "admin"
                  ? "Admin"
                  : profile.can_manage
                    ? "Staff · full"
                    : "Staff · view-only"}
              </span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
