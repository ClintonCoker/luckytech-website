import Link from "next/link";
import { categories, products } from "@/content/products";
import { SectionHead } from "@/components/shared/SectionHead";
import { Reveal } from "@/components/shared/Reveal";
import { DeviceArt } from "@/components/product/DeviceArt";
import { IconArrow } from "@/components/shared/Icons";

const art = {
  smartphones: <DeviceArt style="tecno" tint={["#e6eef2", "#94aab6"]} id="cat-smart" className="h-full w-auto" />,
  tablets: <DeviceArt style="tablet" tint={["#2a3346", "#56688f"]} id="cat-tab" className="h-full w-auto" />,
  budget: <DeviceArt style="keypad" tint={["#2d3c5c", "#5b77b0"]} id="cat-keypad" className="h-full w-auto" />,
};

export function CategoryGrid() {
  return (
    <section className="wrap py-24 sm:py-32" aria-labelledby="cat-title">
      <SectionHead id="cat-title" eyebrow="Shop by category" title={<>Everything mobile,<br />under one roof.</>} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08}>
            <Link href={`/shop?category=${c.id}`} className="card card-glow group flex h-72 flex-col justify-between p-6">
              <div className="relative z-10">
                <p className="text-sm text-mist">{products.filter((p) => p.category === c.id).length} products</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">{c.label}</h3>
                <p className="mt-2 max-w-[16rem] text-sm text-mist">{c.blurb}</p>
              </div>
              <div className="absolute -bottom-6 right-4 h-44 transition-transform duration-700 group-hover:-translate-y-3 group-hover:rotate-[-6deg]">{art[c.id]}</div>
              <IconArrow className="relative z-10 text-glow transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        ))}
        <Reveal delay={0.24}>
          <Link href="/accessories" className="card card-glow group relative flex h-72 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand to-[#06331a] p-6">
            <div className="relative z-10">
              <p className="text-sm text-white/70">Chargers · pouches · screen guards · more</p>
              <h3 className="mt-1 font-display text-2xl font-semibold">Accessories & gadgets</h3>
              <p className="mt-2 max-w-[16rem] text-sm text-white/75">Power banks, JBL and Zealot speakers, smartwatches, original screens.</p>
            </div>
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full border-[18px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-2 right-16 h-20 w-20 rounded-full border-[10px] border-signal/60" />
            <IconArrow className="relative z-10 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
