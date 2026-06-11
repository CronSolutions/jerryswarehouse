"use client";

import Link from "next/link";
import { useCart, type CartItem } from "@/lib/cart";

export default function AddToCartButton({ item }: { item: CartItem }) {
  const { has, add, remove } = useCart();
  const inCart = has(item.id);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {inCart ? (
        <>
          <button
            onClick={() => remove(item.id)}
            className="border border-[#c49335] text-[#c49335] hover:bg-[#c49335] hover:text-white font-semibold text-sm px-8 py-4 rounded transition-colors"
          >
            Remove from cart
          </button>
          <Link
            href="/shop/cart"
            className="bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm px-8 py-4 rounded transition-colors"
          >
            View cart →
          </Link>
        </>
      ) : (
        <button
          onClick={() => add(item)}
          className="bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm px-8 py-4 rounded transition-colors"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
