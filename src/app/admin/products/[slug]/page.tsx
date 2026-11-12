import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth.server";
import { db, dbConfigured, rowToProduct, type ProductRow } from "@/lib/db.server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  if (!dbConfigured()) redirect("/admin");
  const { data } = await db().from("products").select("*").eq("slug", (await params).slug).maybeSingle();
  if (!data) notFound();
  const product = rowToProduct(data as ProductRow);
  return (
    <AdminShell>
      <h1 className="mb-8 font-display text-3xl font-semibold">Edit {product.name}</h1>
      <ProductForm key={product.slug} product={product} />
    </AdminShell>
  );
}
