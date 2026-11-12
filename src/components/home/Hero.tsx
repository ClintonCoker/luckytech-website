import Link from "next/link";
import { heroClips } from "@/content/media";
import { HeroVideo } from "@/components/home/HeroVideo";
import { DeviceStage } from "@/components/home/DeviceStage";
import { HeroText } from "@/components/home/HeroText";

export function Hero({ productCount }: { productCount: number }) {
  const hasVideo = heroClips.length > 0;
  return (
    <section className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28" aria-labelledby="hero-title">
      <div className="aurora" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />
      <HeroVideo clips={heroClips} />
      {hasVideo && <div className="hero-shade" aria-hidden="true" />}
      <div className={`wrap relative grid items-center gap-12 ${hasVideo ? "" : "lg:grid-cols-[1.1fr_1fr]"}`}>
        <HeroText productCount={productCount} />
        {!hasVideo && <DeviceStage />}
      </div>
      <Link href="#featured" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-mist hover:text-white sm:flex">
        Scroll
        <span className="h-10 w-[2px] overflow-hidden rounded-full bg-white/10"><span className="block h-1/2 w-full animate-[float_1.8s_ease-in-out_infinite] bg-glow" /></span>
      </Link>
    </section>
  );
}
