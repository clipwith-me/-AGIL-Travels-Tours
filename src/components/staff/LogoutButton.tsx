"use client";

import { createSupabaseBrowserAuth } from "@/lib/supabase-auth-browser";

export function LogoutButton() {
  async function logout() {
    const supabase = createSupabaseBrowserAuth();
    await supabase.auth.signOut();
    window.location.href = "/staff/login";
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
