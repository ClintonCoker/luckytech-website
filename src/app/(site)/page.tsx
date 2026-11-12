import { Hero } from "@/components/home/Hero";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { Featured } from "@/components/home/Featured";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Services } from "@/components/home/Services";
import { PayLater } from "@/components/home/PayLater";
import { RequestCta } from "@/components/home/RequestCta";
import { SectionHead } from "@/components/shared/SectionHead";
import { BranchCards } from "@/components/shared/BranchCards";
import { Faq } from "@/components/shared/Faq";
import { branches, faqs, store } from "@/content/store";
import { getSiteUrl } from "@/lib/env";
import { getCatalog } from "@/lib/catalog.server";

export default async function Home() {
  const catalog = await getCatalog();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": branches.map((b) => ({
      "@type": "MobilePhoneStore",
      name: `${store.legalName}, ${b.city}`,
      url: getSiteUrl(),
      telephone: b.phones.map((p) => `+234${p.slice(1)}`),
      address: { "@type": "PostalAddress", streetAddress: b.address.join(", "), addressLocality: b.city, addressRegion: b.state, addressCountry: "NG" },
      priceRange: "₦₦",
    })).concat([{ "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) } as never]),
  };
  return (
    <>
      <Hero productCount={catalog.length} />
      <BrandMarquee />
      <Featured catalog={catalog} />
      <CategoryGrid catalog={catalog} />
      <Services />
      <PayLater catalog={catalog} />
      <RequestCta />
      <section className="wrap py-24 sm:py-32" aria-labelledby="stores-title">
        <SectionHead id="stores-title" eyebrow="Visit us" title={<>Two stores in Ondo State.</>} body="Walk in, test the phone, get it fixed while you wait. Our main store is in Owo, with a branch in Akure." />
        <BranchCards />
      </section>
      <section className="wrap py-12" aria-labelledby="faq-title">
        <SectionHead id="faq-title" eyebrow="Questions" title="Good to know" />
        <Faq />
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
