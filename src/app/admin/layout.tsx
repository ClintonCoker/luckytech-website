import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | LuckyTech Admin" }, robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-night">{children}</div>;
}
