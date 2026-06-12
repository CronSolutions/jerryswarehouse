import PolicyShell, { PolicyHeading } from "@/components/PolicyShell";

export const metadata = { title: "Terms of Service — Jerry's Warehouse" };

export default function TermsPage() {
  return (
    <PolicyShell title="Terms of Service">
      <p>
        By browsing and purchasing from Jerry&apos;s Warehouse, you agree to the
        following terms.
      </p>

      <PolicyHeading>Products & availability</PolicyHeading>
      <p>
        Items are secondhand and one-of-a-kind. Once an item sells, it is no
        longer available. We make every effort to display accurate photos,
        descriptions, condition, and pricing, but do not warrant that all
        information is error-free.
      </p>

      <PolicyHeading>Pricing & payment</PolicyHeading>
      <p>
        Prices are listed in U.S. dollars. Applicable sales tax and any shipping
        fees are shown at checkout. Payments are processed securely by Square; we
        never see or store your full card details.
      </p>

      <PolicyHeading>Orders</PolicyHeading>
      <p>
        We reserve the right to cancel or refund an order if an item is found to
        be unavailable, mispriced, or if we&apos;re unable to verify payment.
      </p>

      <PolicyHeading>Limitation of liability</PolicyHeading>
      <p>
        The site and its contents are provided &ldquo;as is.&rdquo; To the extent
        permitted by law, Jerry&apos;s Warehouse is not liable for indirect or
        incidental damages arising from use of the site or products.
      </p>

      <p className="text-xs text-[#9a6840] pt-6">
        This is a general template — please have it reviewed for your
        jurisdiction before going live.
      </p>
    </PolicyShell>
  );
}
