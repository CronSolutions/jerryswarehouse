import Link from "next/link";
import PolicyShell, { PolicyHeading } from "@/components/PolicyShell";

export const metadata = { title: "Privacy Policy — Jerry's Warehouse" };

export default function PrivacyPage() {
  return (
    <PolicyShell title="Privacy Policy">
      <p>
        We respect your privacy and only collect what we need to fulfill your
        orders and answer your questions.
      </p>

      <PolicyHeading>What we collect</PolicyHeading>
      <p>
        When you place an order, your name, email, and (for shipped orders)
        shipping address are collected to process and deliver your purchase.
        Payment is handled by <strong>Square</strong> — your full card number is
        entered on Square&apos;s secure page and is never stored on our servers.
        If you message us through the contact form, we receive the details you
        provide.
      </p>

      <PolicyHeading>How we use it</PolicyHeading>
      <p>
        We use your information solely to process orders, arrange pickup or
        shipping, respond to inquiries, and keep records of sales. We do not sell
        your information.
      </p>

      <PolicyHeading>Third parties</PolicyHeading>
      <p>
        We rely on trusted providers — including Square (payments) and our
        hosting/database providers — to operate the store. Their handling of data
        is governed by their own privacy policies.
      </p>

      <PolicyHeading>Contact</PolicyHeading>
      <p>
        Questions about your data? Reach us through our{" "}
        <Link href="/#contact" className="text-[#c49335] hover:underline">
          contact form
        </Link>
        .
      </p>

      <p className="text-xs text-[#9a6840] pt-6">
        This is a general template — please review it for your jurisdiction
        before going live.
      </p>
    </PolicyShell>
  );
}
