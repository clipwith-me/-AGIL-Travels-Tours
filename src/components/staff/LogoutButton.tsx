"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserAuth } from "@/lib/supabase-auth-browser";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    const supabase = createSupabaseBrowserAuth();
    await supabase.auth.signOut();
    router.replace("/staff/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
    >
      Sign out
    </button>
  );
}
