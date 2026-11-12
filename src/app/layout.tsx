import type { Metadata, Viewport } from "next";
import "@fontsource-variable/sora/index.css";
import "@fontsource-variable/inter/index.css";
import "@/styles/globals.css";
import { store } from "@/content/store";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${store.name}: Phones, gadgets & repairs in Owo and Akure`, template: `%s | ${store.name}` },
  description: store.description,
  applicationName: store.name,
  openGraph: { type: "website", siteName: store.legalName, locale: "en_NG", url: siteUrl, title: `${store.name}: ${store.tagline}`, description: store.description },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
