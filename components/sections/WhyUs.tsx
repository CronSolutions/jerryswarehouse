"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { VALUE_PROPS } from "@/lib/constants";
import { asset } from "@/lib/asset";

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
      className="pt-10 pb-24 lg:pt-16 lg:pb-32 bg-[#ffffff]"
    >
      <div className="px-6 sm:px-8 lg:px-[150px] relative z-10">
        {/* Eyebrow — stays centered */}
        

        {/* Two-column layout: image left, content right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image — left */}
          <div className="animate-on-scroll order-2 lg:order-1">
            <div className="relative aspect-[5/4] w-full overflow-hidden">
              <Image
                src={asset("/images/why-us.png")}
                alt="Beautifully finished interior featuring our flooring"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Content — right */}
          <div className="animate-on-scroll stagger-1 order-1 lg:order-2">
            {/* Heading: Jerry's | Difference */}
            <h2
              id="why-us-heading"
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#4a2c0a] mb-8 lg:mb-24 leading-tight flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              <span>The Jerry&apos;s</span>
              <span
                className="inline-block h-10 sm:h-12 lg:h-14 w-px bg-[#4a2c0a]/30"
                aria-hidden="true"
              />
              <em className="text-[#c49335] italic">Difference</em>
            </h2>

            {/* Value props — serif italic titles, no icons */}
            <ul role="list" className="space-y-10">
              {VALUE_PROPS.map((prop, index) => (
                <li
                  key={prop.id}
                  className={`animate-on-scroll stagger-${index + 2}`}
                >
                  <article>
                    <h3 className="font-serif italic text-xl lg:text-2xl text-[#4a2c0a] mb-3">
                      {prop.title}
                    </h3>
                    <p className="text-[#6e4218] leading-relaxed text-sm lg:text-base max-w-md">
                      {prop.description}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}