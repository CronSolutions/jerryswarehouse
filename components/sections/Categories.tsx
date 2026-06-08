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
      className="bg-[#fafafa] border-y border-[#e8d8c0] py-16 px-6 sm:px-8 lg:px-[150px]"
      aria-label="Store categories"
    >
      <div className="overflow-hidden">
      <div className="flex w-max animate-marquee">
        {repeated.map((title, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span className="font-serif italic font-normal text-6xl sm:text-7xl text-[#4a2c0a] whitespace-nowrap">
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
