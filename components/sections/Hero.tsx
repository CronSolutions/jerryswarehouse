"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { HERO, STORE_HOURS } from "@/lib/constants";
import { asset } from "@/lib/asset";

function getTodayStatus(): string {
  const dayIndex = new Date().getDay(); // 0 = Sunday
  const hours = STORE_HOURS[dayIndex === 0 ? 6 : dayIndex - 1];
  if (hours.closed) return "Closed today";
  return `Open today · ${hours.open} – ${hours.close}`;
}

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [
      { el: eyebrowRef.current, delay: 100 },
      { el: headlineRef.current, delay: 300 },
      { el: taglineRef.current, delay: 550 },
      { el: ctasRef.current, delay: 750 },
      { el: badgeRef.current, delay: 950 },
    ];

    elements.forEach(({ el, delay }) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    });
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const todayStatus = getTodayStatus();
  const isOpenToday = !todayStatus.startsWith("Closed");

  return (
    <section
      id="hero"
      aria-label="Hero — Welcome to Jerry's Warehouse"
      className="relative min-h-screen flex flex-col justify-center grain-hero overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={asset("/images/hero-bg.webp")}
          alt="Thrift store interior with vintage items"
          fill
          priority
          className="object-cover object-[center_30%]"
        />
      </div>

      {/* Warm dark gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(160deg, rgba(15,13,11,0.45) 0%, rgba(15,13,11,0.6) 40%, rgba(15,13,11,0.92) 80%, rgba(15,13,11,0.98) 100%)",
        }}
      />

      {/* Warm color cast */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(212,168,83,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-[150px] pt-28 pb-20 md:py-0 flex flex-col items-center md:items-start">

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-serif italic text-base sm:text-xl md:text-2xl text-[#c8a07a] max-w-sm md:max-w-xl leading-relaxed hero-text-shadow text-center md:text-left mb-2"
        >
          {HERO.tagline}
        </p>

        {/* Main headline */}
        <h1
          ref={headlineRef}
          className="font-serif text-7xl sm:text-8xl md:text-8xl lg:text-9xl font-bold leading-[1.1] md:leading-[0.92] tracking-tight hero-text-shadow mb-8 text-[#f5eed8] text-center md:text-left"
        >
          {HERO.headline.split("\n").map((line, i) => (
            <span key={i} className="block">
              {i === 0 ? (
                line
              ) : (
                <span className="text-[#d4a853] italic md:-ml-3">{line}</span>
              )}
            </span>
          ))}
        </h1>

        <div ref={ctasRef} className="w-full md:w-auto">
          <button
            onClick={() => scrollTo(HERO.cta1.href)}
            className="group relative overflow-hidden w-full md:w-auto px-10 md:px-24 py-4 md:ml-4 bg-[#d4a853] text-[#0f0d0b] font-semibold text-sm tracking-wide rounded transition-all duration-300 hover:bg-[#e8c278] hover:shadow-[0_0_30px_rgba(212,168,83,0.35)] active:scale-95"
            aria-label="Navigate to location section"
          >
            <span className="relative z-10">{HERO.cta1.label}</span>
          </button>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a853]/30 to-transparent z-10" />
    </section>
  );
}
