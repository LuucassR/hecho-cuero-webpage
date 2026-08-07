"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { ProductImage } from "./ProductImage";

export function ProductGallery({
  images,
  productName,
}: {
  images: { url: string; alt: string }[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-100">
        <ProductImage
          src={active?.url ?? null}
          alt={active?.alt || productName}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActiveIndex(i)}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-lg bg-brand-100 ring-2 transition",
                i === activeIndex ? "ring-brand-900" : "ring-transparent",
              )}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <ProductImage src={img.url} alt={img.alt || productName} sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
