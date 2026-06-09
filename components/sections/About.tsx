"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els =
              entry.target.querySelectorAll<HTMLElement>(".animate-on-scroll");
            els.forEach((el, i) => {
              setTimeout(() => el.classList.add("in-view"), i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="pt-10 pb-10 lg:pt-32 lg:pb-16 bg-[#ffffff]"
    >
      <div className="px-6 sm:px-8 lg:px-[150px] relative z-10">
        {/* Two-column layout: content left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Content — left */}
          <div className="animate-on-scroll lg:order-1">
            <h2
              id="about-heading"
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#4a2c0a] mb-12 leading-tight flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              <span>Our</span>
              <span
                className="inline-block h-10 sm:h-12 lg:h-14 w-px bg-[#4a2c0a]/30"
                aria-hidden="true"
              />
              <em className="text-[#c49335] italic">Story</em>
            </h2>

            <div className="space-y-6 max-w-md">
              <p className="text-[#6e4218] leading-relaxed text-base lg:text-lg animate-on-scroll stagger-1">
                What started as a small vintage spot has grown into one of
                Worcester&apos;s most-loved hidden gems. Jerry&apos;s Warehouse
                is built on a simple idea — that great things deserve a second
                life, and everyone deserves the thrill of the find.
              </p>
              <p className="text-[#6e4218] leading-relaxed text-base lg:text-lg animate-on-scroll stagger-2">
                Every rack and shelf is hand-curated, from 90s denim and band
                tees to one-of-a-kind furniture and collectibles. New treasures
                arrive constantly, so no two visits are ever the same.
              </p>
              <p className="text-[#6e4218] leading-relaxed text-base lg:text-lg animate-on-scroll stagger-3">
                More than a store, it&apos;s a community — a place to dig, to
                discover, and to leave with something that feels like it was
                waiting just for you.
              </p>
            </div>
          </div>

          {/* Image — right */}
          <div className="animate-on-scroll stagger-1 lg:order-2">
            <div className="relative aspect-[5/4] w-full overflow-hidden">
              <Image
                src={asset("/images/about.webp")}
                alt="Inside Jerry's Warehouse — racks of curated vintage finds"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
