import { Instagram, MapPin, ShoppingBag } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import {
  CONTENT_DEFAULTS,
  type FooterContent,
  type StoreInfoContent,
} from "@/lib/content";
import ContactForm from "./ContactForm";

export default function Footer({
  footer,
  storeInfo,
}: {
  footer?: FooterContent;
  storeInfo?: StoreInfoContent;
}) {
  const data = footer ?? CONTENT_DEFAULTS.footer;
  const info = storeInfo ?? CONTENT_DEFAULTS.store_info;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${info.street}, ${info.city}, ${info.state} ${info.zip}`
  )}`;
  return (
    <footer
      id="contact"
      role="contentinfo"
      className="bg-[#f5ede0] border-t border-[#e8d8c0]"
    >
      {/* Main footer content */}
      <div className="px-6 sm:px-8 lg:px-[150px] py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: brand + links */}
          <div>
            {/* Brand */}
            <div className="mb-4">
              <span className="font-serif text-4xl font-bold text-[#c49335] block leading-none">
                Jerry&apos;s
              </span>
              <span className="font-serif text-sm tracking-[0.3em] uppercase text-[#9a6840]">
                Warehouse
              </span>
            </div>
            <p className="font-serif italic text-[#9a6840] text-sm mb-8 max-w-xs">
              &ldquo;{data.tagline}&rdquo;
            </p>

            {/* Social */}
            <div className="flex flex-wrap items-center gap-3 mb-12">
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Jerry's Warehouse on Instagram"
                className="flex items-center gap-2 px-3 py-2 bg-[#ffffff] border border-[#e8d8c0] rounded-lg text-[#6e4218] hover:text-[#c49335] hover:border-[#c49335]/40 transition-all duration-200 text-xs font-medium"
              >
                <Instagram size={13} aria-hidden="true" />
                {data.instagramHandle}
              </a>
              <a
                href={data.ebayUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Jerry's Warehouse on eBay"
                className="flex items-center gap-2 px-3 py-2 bg-[#ffffff] border border-[#e8d8c0] rounded-lg text-[#6e4218] hover:text-[#c49335] hover:border-[#c49335]/40 transition-all duration-200 text-xs font-medium"
              >
                <ShoppingBag size={13} aria-hidden="true" />
                eBay Store
              </a>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Navigation */}
              <div>
                <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c49335] mb-5">
                  Explore
                </h3>
                <nav aria-label="Footer navigation">
                  <ul role="list" className="space-y-3">
                    {NAV_LINKS.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-sm text-[#6e4218] hover:text-[#4a2c0a] transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c49335] mb-5">
                  Visit Us
                </h3>
                <address className="not-italic">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-[#6e4218] hover:text-[#4a2c0a] transition-colors duration-200 group"
                    aria-label={`Get directions to ${info.street}, ${info.city}, ${info.state} ${info.zip}`}
                  >
                    <MapPin
                      size={13}
                      className="text-[#c49335]/60 flex-shrink-0 mt-0.5 group-hover:text-[#c49335] transition-colors"
                      aria-hidden="true"
                    />
                    <span>
                      {info.street}
                      <br />
                      {info.city}, {info.state} {info.zip}
                    </span>
                  </a>
                </address>

                <a
                  href="/admin"
                  className="inline-block mt-5 text-sm text-[#9a6840] hover:text-[#c49335] transition-colors duration-200"
                >
                  Admin
                </a>
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#4a2c0a] mb-2">
              Get in Touch
            </h3>
            <p className="text-sm text-[#6e4218] mb-8 max-w-sm">
              Have a question or just want to say hello? Drop us a line.
            </p>
            <ContactForm />
          </div>
        </div>

        {/* Bottom bar: policies + copyright */}
        <div className="mt-12 pt-6 border-t border-[#e8d8c0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { href: "/shipping", label: "Shipping" },
              { href: "/returns", label: "Returns" },
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs text-[#9a6840] hover:text-[#c49335] transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <p className="text-xs text-[#9a6840]">
            © {new Date().getFullYear()} Jerry&apos;s Warehouse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
