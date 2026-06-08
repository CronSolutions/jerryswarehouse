"use client";

import { useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const REVIEWS = [
  {
    name: "Aurora Faria",
    rating: 5,
    text: "Adored your Hudson location! So excited to visit in your new spot in Worcester. The selection, curation, and passion was all there — and the person who helped me was so enthusiastic and positive, it was honestly refreshing.",
    timeAgo: "1 year ago",
  },
  {
    name: "Peter S",
    rating: 5,
    text: "Been going to Jerry's Warehouse since they first opened, and it's always great! The owners are incredibly friendly, and it's refreshing to find a place where you can haggle for a good deal, which is pretty rare these days.",
    timeAgo: "1 year ago",
  },
  {
    name: "Sam Hogan",
    rating: 5,
    text: "We love Jerry's! Whoever works Sundays is lovely — and so helpful. Great selection of mostly 90s attire. We've found gems each time we've gone. Very fairly priced, and always good jams to boot.",
    timeAgo: "1 year ago",
  },
  {
    name: "Nick",
    rating: 5,
    text: "Without a doubt the greatest shopping experience I've ever had in my life. Incredible selection, great vibes, some of the best people I've met in my life. Would recommend going out of your way to stop by.",
    timeAgo: "1 year ago",
  },
  {
    name: "Kyelele",
    rating: 5,
    text: "Amazing selection and prices. There is always new stuff. Can't get vintage cheaper anywhere else — cheaper than Savers. Owner is extremely nice and welcoming. Couldn't recommend this place enough.",
    timeAgo: "2 months ago",
  },
  {
    name: "Nick Gandza",
    rating: 5,
    text: "Awesome vintage store with lots of great 90s and older pieces. The owner is super friendly and informative.",
    timeAgo: "8 months ago",
  },
  {
    name: "Owen McNally",
    rating: 5,
    text: "Very cool shop, owner is extremely nice. Great vintage pieces for very fair prices.",
    timeAgo: "9 months ago",
  },
  {
    name: "Robbie Lynch",
    rating: 5,
    text: "Great place with fair pricing — definitely a great place to check out.",
    timeAgo: "3 months ago",
  },
  {
    name: "Robbie Caggiula",
    rating: 5,
    text: "Awesome shop, owners are very friendly and helpful. Highly recommend stopping by if you get the chance — no other shop like it around here and great prices on great clothing.",
    timeAgo: "1 year ago",
  },
  {
    name: "Scott Thomas",
    rating: 5,
    text: "Great spot, great vibes, great people. Highly recommend!",
    timeAgo: "2 years ago",
  },
  {
    name: "Zachary Mitrakas",
    rating: 5,
    text: "Awesome spot — the staff is super friendly, and the setup is great. One of a kind store. Highly recommend to anyone in the area.",
    timeAgo: "2 years ago",
  },
  {
    name: "Lidia Kontchaeva",
    rating: 5,
    text: "Really great spot and the owner is awesome.",
    timeAgo: "1 year ago",
  },
  {
    name: "Matthew Donovan",
    rating: 5,
    text: "Cool spot tucked away downtown. Nice collection, good prices.",
    timeAgo: "2 years ago",
  },
  {
    name: "Mitchy B",
    rating: 5,
    text: "The best there is in vintage!",
    timeAgo: "1 year ago",
  },
];

export default function Reviews() {
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
      className="py-24 lg:py-32 bg-[#ffffff]"
    >
      <div className="px-6 sm:px-8 lg:px-[150px]">
        {/* Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <h2
            id="reviews-heading"
            className="font-serif text-4xl md:text-5xl font-bold text-[#4a2c0a] mb-5 leading-tight"
          >
            Loved by{" "}
            <em className="text-[#c49335] not-italic">Worcester</em>
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
            {REVIEWS.map((review, i) => (
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
            className="inline-flex items-center gap-2 text-sm text-[#6e4218] hover:text-[#c49335] transition-colors duration-200"
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
