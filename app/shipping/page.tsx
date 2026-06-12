import Link from "next/link";
import PolicyShell, { PolicyHeading } from "@/components/PolicyShell";

export const metadata = { title: "Shipping & Pickup — Jerry's Warehouse" };

export default function ShippingPage() {
  return (
    <PolicyShell title="Shipping & Pickup">
      <p>
        Every piece at Jerry&apos;s Warehouse is one-of-a-kind, so each order is
        for the exact item pictured.
      </p>

      <PolicyHeading>Local pickup</PolicyHeading>
      <p>
        Choose <strong>Local pickup</strong> at checkout (free) and pick your
        order up in store during regular hours. We&apos;ll reach out once
        it&apos;s set aside and ready for you.
      </p>

      <PolicyHeading>Shipping</PolicyHeading>
      <p>
        We ship within the U.S. for a flat <strong>$8</strong> per order. Orders
        are typically packed and shipped within 2–3 business days. You&apos;ll
        receive a tracking number by email once your order is on its way.
      </p>

      <PolicyHeading>Questions?</PolicyHeading>
      <p>
        Reach out any time through our{" "}
        <Link href="/#contact" className="text-[#c49335] hover:underline">
          contact form
        </Link>{" "}
        and we&apos;ll get right back to you.
      </p>

      <p className="text-xs text-[#9a6840] pt-6">
        Please review and adjust these details to match your actual shipping
        process before going live.
      </p>
    </PolicyShell>
  );
}
