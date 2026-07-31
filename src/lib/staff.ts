import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerAuth } from "./supabase-auth-server";
import { getSupabaseAdmin } from "./supabase";

export type StaffProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "staff";
  can_manage: boolean;
  active: boolean;
};

export type StaffSession = { userId: string; email: string; profile: StaffProfile };

/**
 * Returns the signed-in staff member (with role/permission) or null.
 * The designated ADMIN_EMAIL is auto-provisioned as an admin on first login.
 */
export async function getCurrentStaff(): Promise<StaffSession | null> {
  const supabase = await createSupabaseServerAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;

  try {
    const admin = getSupabaseAdmin();
    const { data: existing, error } = await admin
      .from("staff_users")
      .select("id, email, full_name, role, can_manage, active")
      .eq("id", user.id)
      .maybeSingle();
    if (error) throw error;

    let profile = existing as StaffProfile | null;

    // Bootstrap: the ADMIN_EMAIL becomes an admin automatically on first login.
    if (!profile) {
      const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
      if (adminEmail && user.email.toLowerCase() === adminEmail) {
        const seed = {
          id: user.id,
          email: user.email,
          full_name: "Administrator",
          role: "admin" as const,
          can_manage: true,
          active: true,
        };
        const { error: insertError } = await admin.from("staff_users").insert(seed);
        if (insertError) throw insertError;
        profile = seed;
      } else {
        return null; // Authenticated but not a registered staff member.
      }
    }

    if (!profile.active) return null;
    return { userId: user.id, email: user.email, profile };
  } catch (err) {
    // Misconfiguration (missing service key / tables not created / DB down):
    // fail closed rather than crashing the whole render.
    console.error(
      "getCurrentStaff failed — check SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, and that 003_staff_auth.sql has been run:",
      err,
    );
    return null;
  }
}

export async function requireStaff(): Promise<StaffSession> {
  const session = await getCurrentStaff();
  if (!session) redirect("/staff/login");
  return session;
}

export async function requireAdmin(): Promise<StaffSession> {
  const session = await requireStaff();
  if (session.profile.role !== "admin") redirect("/staff");
  return session;
}
