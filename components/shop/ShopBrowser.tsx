"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productImageUrl, formatPrice, type Product } from "@/lib/shop";

type Sort = "newest" | "price-asc" | "price-desc";

const selectCls =
  "bg-white border border-[#e8d8c0] rounded-lg px-3 py-2 text-sm text-[#4a2c0a] focus:border-[#c49335] focus:outline-none transition-colors";

export default function ShopBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    [products]
  );
  const sizes = useMemo(
    () => Array.from(new Set(products.map((p) => p.size).filter(Boolean))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (size && p.size !== size) return false;
      if (q && !`${p.name} ${p.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price_cents - b.price_cents);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price_cents - a.price_cents);
    // "newest" keeps the server order (already newest-first)
    return list;
  }, [products, query, category, size, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className={`${selectCls} flex-1 min-w-[160px]`}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value)} className={selectCls}>
          <option value="">All sizes</option>
          {sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#9a6840] py-16">No items match your filters.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {filtered.map((p) => {
            const sold = p.status === "sold";
            return (
              <li key={p.id}>
                <Link href={`/shop/${p.id}`} className="group block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5ede0] mb-3">
                    {p.images[0] && (
                      <Image
                        src={productImageUrl(p.images[0])}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          sold ? "opacity-60" : ""
                        }`}
                      />
                    )}
                    {sold && (
                      <span className="absolute top-3 left-3 bg-[#4a2c0a] text-white text-xs font-semibold tracking-wide px-2.5 py-1 rounded">
                        SOLD
                      </span>
                    )}
                  </div>
                  <h2 className="font-medium text-[#4a2c0a] text-sm leading-snug line-clamp-1">
                    {p.name}
                  </h2>
                  <p className="text-sm text-[#6e4218] mt-0.5">
                    {formatPrice(p.price_cents)}
                    {p.size && <span className="text-[#9a6840]"> · {p.size}</span>}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
