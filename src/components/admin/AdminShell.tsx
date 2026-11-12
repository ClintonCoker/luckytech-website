import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { logoutAction } from "@/app/admin/actions";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-night/85 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2.5 font-display font-semibold">
            <BrandMark height={36} />
            Admin
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin" className="rounded-full px-3 py-2 text-mist hover:text-cloud">Stock</Link>
            <Link href="/admin/products/new" className="rounded-full px-3 py-2 text-mist hover:text-cloud">Add product</Link>
            <Link href="/" target="_blank" className="rounded-full px-3 py-2 text-mist hover:text-cloud">View shop ↗</Link>
            <form action={logoutAction}>
              <button type="submit" className="rounded-full px-3 py-2 text-mist hover:text-cloud">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="wrap py-10">{children}</main>
    </>
  );
}
