import "server-only";
import { getSupabaseAdmin } from "./supabase";
import type { StaffProfile } from "./staff";

export async function listStaffUsers(): Promise<StaffProfile[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("staff_users")
    .select("id, email, full_name, role, can_manage, active")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as StaffProfile[];
}

export async function createStaffUser(input: {
  email: string;
  password: string;
  fullName: string;
  role: "admin" | "staff";
  canManage: boolean;
}): Promise<void> {
  const admin = getSupabaseAdmin();

  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(error?.message ?? "Could not create the login.");
  }

  const { error: profileErr } = await admin.from("staff_users").insert({
    id: data.user.id,
    email: input.email,
    full_name: input.fullName || null,
    role: input.role,
    can_manage: input.role === "admin" ? true : input.canManage,
    active: true,
  });
  if (profileErr) {
    // Roll back the auth user so we don't leave an orphaned login.
    await admin.auth.admin.deleteUser(data.user.id).catch(() => {});
    throw new Error(profileErr.message);
  }
}

export async function updateStaffUser(
  id: string,
  patch: { role?: "admin" | "staff"; canManage?: boolean; active?: boolean },
): Promise<void> {
  const admin = getSupabaseAdmin();
  const update: Record<string, unknown> = {};
  if (patch.role !== undefined) update.role = patch.role;
  if (patch.canManage !== undefined) update.can_manage = patch.canManage;
  if (patch.active !== undefined) update.active = patch.active;
  if (Object.keys(update).length === 0) return;

  const { error } = await admin.from("staff_users").update(update).eq("id", id);
  if (error) throw new Error(error.message);
}
