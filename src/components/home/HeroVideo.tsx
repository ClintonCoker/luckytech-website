"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { HeroClip } from "@/content/media";

/** Plays the hero clips in turn with a cross-fade. Shows the first poster for reduced motion. */
export function HeroVideo({ clips }: { clips: HeroClip[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const set = () => setSmall(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const v = refs.current[active];
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    const next = () => setActive((a) => (a + 1) % clips.length);
    // Start the next clip a moment before this one ends so they overlap.
    const onTime = () => {
      if (clips.length > 1 && v.duration && v.currentTime > v.duration - 1.2) {
        v.removeEventListener("timeupdate", onTime);
        next();
      }
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", next);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", next);
    };
  }, [active, clips.length, reduced]);

  if (clips.length === 0) return null;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {clips.map((c, i) => (
        <video
          key={c.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="hero-video"
          style={{ opacity: i === active ? 1 : 0 }}
          src={small && c.mobile ? c.mobile : c.src}
          poster={c.poster}
          muted
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          loop={clips.length === 1}
          autoPlay={i === 0 && !reduced}
        />
      ))}
    </div>
  );
}
