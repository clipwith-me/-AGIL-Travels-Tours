import { redirect } from "next/navigation";
import Link from "next/link";
import { isStaffAuthed } from "@/lib/staff-auth";
import { LogoutButton } from "@/components/staff/LogoutButton";

export default async function StaffDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isStaffAuthed())) redirect("/staff/login");

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="border-b border-brand-100 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/staff" className="text-sm font-bold text-brand-900">
            AGIL · Staff dashboard
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
