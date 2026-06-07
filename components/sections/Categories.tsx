const items = ["Clothes & Apparel", "Collectibles & Vintage", "Shoes & Accessories"];

const separator = (
  <span className="text-[#c49335] font-normal mx-10 select-none" aria-hidden="true">
    ·
  </span>
);

export default function CategoriesBar() {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section
      className="bg-[#faf6ed] border-y border-[#d9cdb8] py-16 overflow-hidden"
      aria-label="Store categories"
    >
      <div className="flex w-max animate-marquee">
        {repeated.map((title, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span className="font-serif italic font-normal text-6xl sm:text-7xl text-[#3d2c1a] whitespace-nowrap">
              {title}
            </span>
            {separator}
          </span>
        ))}
      </div>
    </section>
  );
}
