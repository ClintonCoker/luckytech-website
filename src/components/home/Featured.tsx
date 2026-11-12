import Link from "next/link";
import { products } from "@/content/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHead } from "@/components/shared/SectionHead";
import { Reveal } from "@/components/shared/Reveal";
import { IconArrow } from "@/components/shared/Icons";

export function Featured() {
  const featured = products.filter((p) => p.featured);
  return (
    <section id="featured" className="wrap py-24 sm:py-32" aria-labelledby="featured-title">
      <SectionHead
        id="featured-title"
        eyebrow="Hot right now"
        title={<>Flagships at <span className="text-gradient">honest prices.</span></>}
        body="UK-used iPhones and Galaxies, tested before they leave the shop, and the newest Infinix, Tecno and Redmi phones, brand new in box."
        action={<Link href="/shop" className="btn btn-ghost">See all phones <IconArrow /></Link>}
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-3">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
