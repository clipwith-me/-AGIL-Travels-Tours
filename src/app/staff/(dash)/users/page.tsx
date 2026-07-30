import Link from "next/link";
import { requireAdmin } from "@/lib/staff";
import { listStaffUsers } from "@/lib/staff-admin";
import { UserManager } from "@/components/staff/UserManager";

export const dynamic = "force-dynamic";

export default async function StaffUsersPage() {
  const { userId } = await requireAdmin();
  const users = await listStaffUsers();

  return (
    <div>
      <Link href="/staff" className="text-sm font-medium text-brand-600 hover:text-brand-900">
        ← Applications
      </Link>
      <h1 className="mt-4 text-xl font-bold text-brand-900">Staff users</h1>
      <p className="mt-1 text-sm text-brand-500">
        Create staff logins and set their access level. Admins can do everything;
        staff can be given full (approve/decline) or view-only access.
      </p>
      <div className="mt-6">
        <UserManager users={users} currentUserId={userId} />
      </div>
    </div>
  );
}
