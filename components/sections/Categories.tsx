import { MARQUEE_ITEMS } from "@/lib/constants";
import type { CategoriesContent } from "@/lib/content";

const separator = (
  <span className="text-[#c49335] font-normal mx-10 select-none" aria-hidden="true">
    ·
  </span>
);

export default function CategoriesBar({ content }: { content?: CategoriesContent }) {
  const items = content?.items?.length ? content.items : MARQUEE_ITEMS;
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section
      className="bg-[#fafafa] border-y border-[#e8d8c0] py-4 px-6 sm:px-8 lg:px-[150px]"
      aria-label="Store categories"
    >
      <div className="overflow-hidden py-3">
      <div className="flex w-max items-center animate-marquee leading-normal">
        {repeated.map((title, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span className="font-serif italic font-normal text-4xl sm:text-6xl leading-[1.5] text-[#4a2c0a] whitespace-nowrap">
              {title}
            </span>
            {separator}
          </span>
        ))}
      </div>
      </div>
    </section>
  );
}
