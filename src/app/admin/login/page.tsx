import { redirect } from "next/navigation";
import { isAdmin, adminConfigured } from "@/lib/auth.server";
import { LoginForm } from "@/components/admin/LoginForm";
import { BrandMark } from "@/components/layout/BrandMark";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div className="aurora" aria-hidden="true" />
      <div className="card relative w-full max-w-sm p-8">
        <BrandMark height={52} />
        <h1 className="mt-6 font-display text-2xl font-semibold">LuckyTech admin</h1>
        <p className="mt-1 text-sm text-mist">Stock and products. Staff only.</p>
        {!adminConfigured() && (
          <p role="alert" className="mt-5 rounded-2xl bg-[#ffb020]/10 p-3 text-sm ring-1 ring-[#ffb020]/40">
            No admin password is set yet. Add <code className="font-mono">ADMIN_PASSWORD</code> (at least 8 characters) to the site settings and restart.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
