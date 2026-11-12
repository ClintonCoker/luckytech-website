import { requireAdmin } from "@/lib/auth.server";
import { dbConfigured } from "@/lib/db.server";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin();
  if (!dbConfigured()) redirect("/admin");
  return (
    <AdminShell>
      <h1 className="mb-8 font-display text-3xl font-semibold">Add a product</h1>
      <ProductForm />
    </AdminShell>
  );
}
