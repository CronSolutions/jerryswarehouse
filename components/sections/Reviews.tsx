"use client";

import { useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { CONTENT_DEFAULTS, type ReviewsContent } from "@/lib/content";

export default function Reviews({ content }: { content?: ReviewsContent }) {
  const data = content ?? CONTENT_DEFAULTS.reviews;
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll<HTMLElement>(".animate-on-scroll");
            els.forEach((el, i) => setTimeout(() => el.classList.add("in-view"), i * 150));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <section
      id="reviews"
      ref={sectionRef}
      aria-labelledby="reviews-heading"
      className="py-24 lg:py-32 bg-[#4a2c0a]"
    >
      <div className="px-6 sm:px-8 lg:px-[150px]">
        {/* Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <h2
            id="reviews-heading"
            className="font-serif text-4xl md:text-5xl font-bold text-[#faf6ed] mb-5 leading-tight"
          >
            {data.headingLead}{" "}
            <em className="text-[#d4a853] not-italic">{data.headingAccent}</em>
          </h2>
          <div className="gold-divider mx-auto" aria-hidden="true" />
        </div>

        {/* Carousel */}
        <div className="relative animate-on-scroll">
          {/* Prev */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll reviews left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-[#f5ede0] border border-[#e8d8c0] items-center justify-center text-[#6e4218] hover:text-[#c49335] hover:border-[#c49335]/40 transition-all duration-200 shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Cards track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
          >
            {data.items.map((review, i) => (
              <article
                key={i}
                className="snap-start shrink-0 w-[82vw] sm:w-80 md:w-[340px] min-h-[380px] bg-[#f5ede0] border border-[#e8d8c0] p-8 flex flex-col gap-5"
              >
                {/* Stars */}
                <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-[#c49335] fill-[#c49335]" aria-hidden="true" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-[#6e4218] text-sm leading-relaxed flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Attribution */}
                <div className="border-t border-[#e8d8c0] pt-4">
                  <p className="font-semibold text-[#4a2c0a] text-sm">{review.name}</p>
                  <p className="text-[#9a6840] text-xs mt-0.5">Google Reviewer · {review.timeAgo}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll reviews right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-[#f5ede0] border border-[#e8d8c0] items-center justify-center text-[#6e4218] hover:text-[#c49335] hover:border-[#c49335]/40 transition-all duration-200 shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Google link */}
        <div className="mt-10 text-center animate-on-scroll">
          <a
            href="https://www.google.com/maps/place/Jerry's+Warehouse/@42.2708309,-71.8103054,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#e8d8c0] hover:text-[#d4a853] transition-colors duration-200"
            aria-label="See all reviews on Google Maps (opens in new tab)"
          >
            <ExternalLink size={14} aria-hidden="true" />
            See all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
