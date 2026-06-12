"use client";

import { useState } from "react";
import Image from "next/image";
import { productImageUrl } from "@/lib/shop";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (images.length === 0) {
    return <div className="aspect-[3/4] w-full bg-[#f5ede0]" />;
  }

  const activeUrl = productImageUrl(images[active]);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setZoom(true)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5ede0] block cursor-zoom-in"
        aria-label="Zoom image"
      >
        <Image
          src={activeUrl}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((path, i) => (
            <button
              key={path}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden bg-[#f5ede0] transition ${
                i === active ? "ring-2 ring-[#c49335]" : "opacity-80 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={productImageUrl(path)} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl aspect-[3/4]">
            <Image src={activeUrl} alt={name} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            onClick={() => setZoom(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white text-2xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
