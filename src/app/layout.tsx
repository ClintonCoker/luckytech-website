import type { Metadata, Viewport } from "next";
import "@fontsource-variable/sora/index.css";
import "@fontsource-variable/inter/index.css";
import "@/styles/globals.css";
import { store } from "@/content/store";
import { getSiteUrl } from "@/lib/env";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${store.name}: Phones, gadgets & repairs in Owo and Akure`, template: `%s | ${store.name}` },
  description: store.description,
  applicationName: store.name,
  openGraph: { type: "website", siteName: store.legalName, locale: "en_NG", url: siteUrl, title: `${store.name}: ${store.tagline}`, description: store.description },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#040b07", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="min-h-dvh antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-night">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
