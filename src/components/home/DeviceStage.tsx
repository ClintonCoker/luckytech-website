"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { DeviceArt } from "@/components/product/DeviceArt";

/** Floating iPhone and Android pair that follows the pointer. */
export function DeviceStage() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotX = useTransform(sy, [-1, 1], [10, -10]);
  const backX = useTransform(sx, [-1, 1], [-18, 18]);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[34rem] [perspective:1400px]"
      onPointerMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(62_224_127/0.35),transparent_65%)] blur-2xl" />
      <div className="absolute inset-[22%] rounded-full border border-glow/20" />
      <div className="absolute inset-[8%] rounded-full border border-white/5" />
      <motion.div style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }} className="absolute inset-0">
        <motion.div style={{ x: backX }} className="absolute left-[14%] top-[10%] h-[74%] w-[36%] animate-float [--r:-10deg] [animation-delay:-2s]">
          <DeviceArt style="galaxy-s" tint={["#2d4a3e", "#14251d"]} id="hero-android" pro className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.6)]" />
        </motion.div>
        <div className="absolute right-[14%] top-[14%] h-[76%] w-[37%] animate-float [--r:8deg]">
          <DeviceArt style="iphone" tint={["#d9c9b0", "#8e7a5c"]} id="hero-iphone" view="front" className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.65)]" />
        </div>
      </motion.div>
      <div className="glass absolute bottom-[9%] left-[2%] rounded-2xl px-4 py-3 text-sm shadow-xl">
        <p className="font-semibold">Repair in under 45 min</p>
        <p className="text-xs text-mist">Wait while we fix it</p>
      </div>
      <div className="glass absolute right-[0%] top-[6%] rounded-2xl px-4 py-3 text-sm shadow-xl">
        <p className="font-semibold"><span className="text-glow">30%</span> down payment</p>
        <p className="text-xs text-mist">Buy now, pay later</p>
      </div>
    </div>
  );
}
