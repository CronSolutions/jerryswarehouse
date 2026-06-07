"use client";

import { useEffect, useRef } from "react";
import { Heart, ArrowRight, Package } from "lucide-react";
import { DONATIONS } from "@/lib/constants";

export default function DonationsCTA() {
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
      id="donations"
      ref={sectionRef}
      aria-labelledby="donations-heading"
      className="py-24 lg:py-32 bg-[#f3ece0]"
    >

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Icon */}
        <div className="animate-on-scroll flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#faf6ed] border border-[#c49335]/30 flex items-center justify-center">
              <Heart
                size={28}
                className="text-[#c49335]"
                strokeWidth={1.5}
                fill="rgba(196,147,53,0.15)"
              />
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        <p className="section-eyebrow mb-5 animate-on-scroll">
          Give Back to the Community
        </p>

        {/* Heading */}
        <h2
          id="donations-heading"
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d2c1a] mb-4 leading-tight animate-on-scroll"
        >
          {DONATIONS.headline}
        </h2>

        <p className="font-serif italic text-xl text-[#c49335] mb-6 animate-on-scroll">
          {DONATIONS.subheadline}
        </p>

        <div className="gold-divider mx-auto mb-8 animate-on-scroll" aria-hidden="true" />

        {/* Body text */}
        <p className="text-[#6b5444] text-base leading-relaxed max-w-2xl mx-auto mb-10 animate-on-scroll">
          {DONATIONS.body}
        </p>

        {/* Accepted items callout */}
        <div className="animate-on-scroll mb-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-[#faf6ed] border border-[#d9cdb8] rounded-xl px-6 py-4">
            <Package size={14} className="text-[#c49335]" aria-hidden="true" />
            <span className="text-xs text-[#9a7f6a] tracking-wide">
              We accept:
            </span>
            {[
              "Clothing",
              "Furniture",
              "Housewares",
              "Electronics",
              "Books",
              "Toys",
            ].map((item) => (
              <span
                key={item}
                className="text-xs px-2.5 py-1 bg-[#ede6d7] text-[#6b5444] rounded-full font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="animate-on-scroll">
          <a
            href={DONATIONS.ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c49335] hover:bg-[#d4a853] text-[#faf6ed] font-semibold text-sm tracking-wide rounded-lg transition-all duration-200 group"
            aria-label="Learn about dropping off donations at Jerry's Warehouse"
          >
            {DONATIONS.ctaText}
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* Stats note */}
        <p className="mt-8 text-xs text-[#9a7f6a] animate-on-scroll">
          {DONATIONS.statsLabel}
        </p>
      </div>
    </section>
  );
}
