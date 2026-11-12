"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/content/products";
import { ProductMedia } from "@/components/product/ProductMedia";

export function ProductGallery({ product, children }: { product: Product; children?: React.ReactNode }) {
  const images = product.images ?? [];
  const [i, setI] = useState(0);
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="card relative aspect-square overflow-hidden bg-panel">
        <AnimatePresence mode="wait">
          <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <ProductMedia product={product} index={i} priority={i === 0} sizes="(min-width: 1024px) 45vw, 95vw" />
          </motion.div>
        </AnimatePresence>
        {children}
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label="More photos">
          {images.map((src, n) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-label={`Photo ${n + 1} of ${images.length}`}
                aria-pressed={i === n}
                className={`relative block aspect-square w-full overflow-hidden rounded-xl ring-2 transition ${i === n ? "ring-glow" : "ring-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
