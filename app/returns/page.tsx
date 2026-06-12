import Link from "next/link";
import PolicyShell, { PolicyHeading } from "@/components/PolicyShell";

export const metadata = { title: "Returns — Jerry's Warehouse" };

export default function ReturnsPage() {
  return (
    <PolicyShell title="Returns">
      <p>
        Because our inventory is secondhand and one-of-a-kind, we generally treat
        <strong> all sales as final</strong>. We do our best to photograph and
        describe each item — including its condition — as accurately as possible.
      </p>

      <PolicyHeading>If something&apos;s not right</PolicyHeading>
      <p>
        If your item arrives damaged in transit or is materially not as
        described, please contact us within <strong>3 days</strong> of delivery
        (or pickup) with your order details and a photo, and we&apos;ll make it
        right — typically with a refund or store credit.
      </p>

      <PolicyHeading>How to reach us</PolicyHeading>
      <p>
        Message us through our{" "}
        <Link href="/#contact" className="text-[#c49335] hover:underline">
          contact form
        </Link>{" "}
        and include your order number.
      </p>

      <p className="text-xs text-[#9a6840] pt-6">
        Please review this policy with the shop owner and adjust the terms before
        going live.
      </p>
    </PolicyShell>
  );
}
