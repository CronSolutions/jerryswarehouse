"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { productImageUrl, formatPrice, SHIPPING_CENTS } from "@/lib/shop";
import { createCheckout } from "@/app/shop/checkout/actions";

export default function CartView() {
  const { items, remove, subtotalCents } = useCart();
  const [fulfillment, setFulfillment] = useState<"pickup" | "shipping">("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = fulfillment === "shipping" ? SHIPPING_CENTS : 0;
  const total = subtotalCents + shipping;

  async function checkout() {
    setSubmitting(true);
    setError(null);
    const res = await createCheckout(
      items.map((i) => i.id),
      fulfillment
    );
    if (res.ok) {
      window.location.href = res.url; // off to Square's secure checkout
    } else {
      setError(res.error);
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#6e4218] mb-6">Your cart is empty.</p>
        <Link
          href="/shop"
          className="inline-block bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm px-6 py-3 rounded transition-colors"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const rowCls = "flex justify-between text-sm";

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
      {/* Items */}
      <ul className="divide-y divide-[#e8d8c0] border-y border-[#e8d8c0]">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5">
            <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-[#f5ede0]">
              {item.image && (
                <Image
                  src={productImageUrl(item.image)}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/shop/${item.id}`}
                className="font-medium text-[#4a2c0a] hover:text-[#c49335] transition-colors"
              >
                {item.name}
              </Link>
              {item.size && (
                <p className="text-sm text-[#9a6840] mt-0.5">Size {item.size}</p>
              )}
              <button
                onClick={() => remove(item.id)}
                className="text-xs text-red-600 hover:underline mt-2"
              >
                Remove
              </button>
            </div>
            <p className="font-medium text-[#4a2c0a]">{formatPrice(item.price_cents)}</p>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="bg-[#faf6ed] border border-[#e8d8c0] rounded-xl p-6 space-y-5">
        <h2 className="font-serif text-xl font-bold text-[#4a2c0a]">Summary</h2>

        {/* Fulfillment */}
        <div className="space-y-2">
          {(["pickup", "shipping"] as const).map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                fulfillment === opt
                  ? "border-[#c49335] bg-white"
                  : "border-[#e8d8c0]"
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillment === opt}
                onChange={() => setFulfillment(opt)}
              />
              <span className="text-sm text-[#4a2c0a] capitalize flex-1">
                {opt === "pickup" ? "Local pickup" : "Shipping"}
              </span>
              <span className="text-sm text-[#6e4218]">
                {opt === "pickup" ? "Free" : formatPrice(SHIPPING_CENTS)}
              </span>
            </label>
          ))}
          {fulfillment === "shipping" && (
            <p className="text-xs text-[#9a6840]">
              You&apos;ll enter your shipping address on the secure Square checkout.
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-[#e8d8c0]">
          <div className={rowCls}>
            <span className="text-[#6e4218]">Subtotal</span>
            <span className="text-[#4a2c0a]">{formatPrice(subtotalCents)}</span>
          </div>
          <div className={rowCls}>
            <span className="text-[#6e4218]">Shipping</span>
            <span className="text-[#4a2c0a]">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-[#4a2c0a] pt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={checkout}
          disabled={submitting}
          className="w-full bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm px-6 py-3.5 rounded transition-colors disabled:opacity-50"
        >
          {submitting ? "Redirecting to Square…" : "Checkout securely with Square"}
        </button>
        <p className="text-xs text-center text-[#9a6840]">
          Payments are processed securely by Square.
        </p>
      </div>
    </div>
  );
}
