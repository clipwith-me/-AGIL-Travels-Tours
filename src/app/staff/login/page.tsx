import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/staff/LoginForm";
import { isStaffAuthed } from "@/lib/staff-auth";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export default async function StaffLoginPage() {
  if (await isStaffAuthed()) redirect("/staff");

  return (
    <section className="bg-sand-50">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-brand-900">Staff dashboard</h1>
          <p className="mt-1 text-sm text-brand-500">
            Sign in to review UAE visa applications.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
