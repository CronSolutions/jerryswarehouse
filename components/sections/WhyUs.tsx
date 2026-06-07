"use client";

import { useEffect, useRef } from "react";
import { RefreshCw, Tag, Sparkles, type LucideIcon } from "lucide-react";
import { VALUE_PROPS } from "@/lib/constants";

const ICON_MAP: Record<string, LucideIcon> = {
  RefreshCw,
  Tag,
  Sparkles,
};

export default function WhyUs() {
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
      id="why-us"
      ref={sectionRef}
      aria-labelledby="why-us-heading"
      className="py-24 lg:py-32 bg-[#f3ece0]"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-on-scroll">
          <p className="section-eyebrow mb-4">Why Jerry&apos;s</p>
          <h2
            id="why-us-heading"
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d2c1a] mb-5 leading-tight"
          >
            The Jerry&apos;s{" "}
            <em className="text-[#c49335] not-italic">Difference</em>
          </h2>
          <div className="gold-divider mx-auto" aria-hidden="true" />
        </div>

        {/* Value props */}
        <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {VALUE_PROPS.map((prop, index) => {
            const Icon = ICON_MAP[prop.iconName];
            return (
              <li
                key={prop.id}
                className={`animate-on-scroll stagger-${index + 1}`}
              >
                <article className="text-center flex flex-col items-center">
                  {/* Icon ring */}
                  <div
                    className="relative mb-8"
                    aria-hidden="true"
                  >
                    <div className="w-20 h-20 rounded-full border border-[#c49335]/30 flex items-center justify-center bg-[#faf6ed]">
                      <div className="w-14 h-14 rounded-full border border-[#c49335]/20 bg-[#ede6d7] flex items-center justify-center">
                        {Icon && (
                          <Icon
                            size={24}
                            className="text-[#c49335]"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl lg:text-3xl font-bold text-[#3d2c1a] mb-4 relative z-10">
                    {prop.title}
                  </h3>

                  <div
                    className="w-8 h-px bg-[#c49335]/50 mb-5"
                    aria-hidden="true"
                  />

                  <p className="text-[#6b5444] leading-relaxed text-sm max-w-sm">
                    {prop.description}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
