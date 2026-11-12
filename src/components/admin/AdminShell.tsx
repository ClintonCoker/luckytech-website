import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-night/85 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2.5 font-display font-semibold">
            <span className="grid h-9 w-11 place-items-center rounded-lg bg-brand text-xs font-extrabold"><span className="whitespace-nowrap">L<span className="text-signal-soft">K</span>T</span></span>
            Admin
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin" className="rounded-full px-3 py-2 text-mist hover:text-white">Stock</Link>
            <Link href="/admin/products/new" className="rounded-full px-3 py-2 text-mist hover:text-white">Add product</Link>
            <Link href="/" target="_blank" className="rounded-full px-3 py-2 text-mist hover:text-white">View shop ↗</Link>
            <form action={logoutAction}>
              <button type="submit" className="rounded-full px-3 py-2 text-mist hover:text-white">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="wrap py-10">{children}</main>
    </>
  );
}
