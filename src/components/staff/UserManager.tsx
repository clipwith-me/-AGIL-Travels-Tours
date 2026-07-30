"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StaffProfile } from "@/lib/staff";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export function UserManager({
  users,
  currentUserId,
}: {
  users: StaffProfile[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [canManage, setCanManage] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setCreating(true);
    try {
      const res = await fetch("/api/staff/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, password, role, canManage }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not create user.");
        return;
      }
      setOk(`Created ${email}.`);
      setEmail("");
      setFullName("");
      setPassword("");
      setRole("staff");
      setCanManage(false);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setCreating(false);
    }
  }

  async function patchUser(id: string, patch: Record<string, unknown>) {
    await fetch(`/api/staff/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Create user */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="text-sm font-semibold text-brand-900">Add a staff member</h2>
        <form onSubmit={createUser} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-brand-800">Full name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-800">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-800">Temporary password</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} placeholder="Min 8 characters" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-800">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "staff")} className={fieldClass}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {role === "staff" && (
            <label className="flex items-center gap-2 text-sm text-brand-700 sm:col-span-2">
              <input type="checkbox" checked={canManage} onChange={(e) => setCanManage(e.target.checked)} className="h-4 w-4" />
              Can approve / decline applications (unlimited). Leave unchecked for view-only.
            </label>
          )}
          {error && <p className="text-sm font-medium text-red-600 sm:col-span-2">{error}</p>}
          {ok && <p className="text-sm font-medium text-green-700 sm:col-span-2">{ok}</p>}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-full bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-brand-400">
          Share the temporary password with the staff member securely. They can change it later.
        </p>
      </div>

      {/* User list */}
      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-100 bg-sand-50 text-xs uppercase tracking-wide text-brand-500">
            <tr>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Access</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-brand-900">{u.full_name || "—"}</div>
                    <div className="text-xs text-brand-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {u.role === "admin" ? (
                      <span className="rounded-full bg-brand-800 px-2.5 py-0.5 text-xs font-semibold text-white">Admin</span>
                    ) : (
                      <select
                        value={u.can_manage ? "manage" : "view"}
                        onChange={(e) => patchUser(u.id, { canManage: e.target.value === "manage" })}
                        className="rounded-lg border border-brand-200 px-2 py-1 text-xs"
                      >
                        <option value="view">View-only</option>
                        <option value="manage">Full (approve/decline)</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${u.active ? "text-green-700" : "text-red-600"}`}>
                      {u.active ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isSelf && (
                      <button
                        onClick={() => patchUser(u.id, { active: !u.active })}
                        className="rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                      >
                        {u.active ? "Deactivate" : "Reactivate"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
