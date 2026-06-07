import { Instagram, MapPin, Clock, ShoppingBag } from "lucide-react";
import { STORE_INFO, SOCIAL_LINKS, FOOTER, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-[#ede6d7] border-t border-[#d9cdb8]"
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="font-serif text-3xl font-bold text-[#c49335] block leading-none">
                Jerry&apos;s
              </span>
              <span className="font-serif text-sm tracking-[0.3em] uppercase text-[#9a7f6a]">
                Warehouse
              </span>
            </div>
            <p className="font-serif italic text-[#9a7f6a] text-sm mb-6 max-w-xs">
              &ldquo;{FOOTER.tagline}&rdquo;
            </p>

            {/* Social */}
            <div className="flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="flex items-center gap-2 px-3 py-2 bg-[#faf6ed] border border-[#d9cdb8] rounded-lg text-[#6b5444] hover:text-[#c49335] hover:border-[#c49335]/40 transition-all duration-200 text-xs font-medium"
                >
                  <Instagram size={13} aria-hidden="true" />
                  {social.handle}
                </a>
              ))}
              <a
                href="https://www.ebay.com/usr/miso_242497?mkcid=16&mkevt=1&mkrid=711-127632-2357-0&ssspo=vrnrm_g4r4u&sssrc=4623447&ssuid=vrnrm_g4r4u&stype=1&widget_ver=artemis&media=COPY"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Jerry's Warehouse on eBay"
                className="flex items-center gap-2 px-3 py-2 bg-[#faf6ed] border border-[#d9cdb8] rounded-lg text-[#6b5444] hover:text-[#c49335] hover:border-[#c49335]/40 transition-all duration-200 text-xs font-medium"
              >
                <ShoppingBag size={13} aria-hidden="true" />
                eBay Store
              </a>
            </div>
          </div>

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
                      className="text-sm text-[#6b5444] hover:text-[#3d2c1a] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Address + hours */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c49335] mb-5">
              Visit Us
            </h3>

            <address className="not-italic mb-5">
              <a
                href={STORE_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-[#6b5444] hover:text-[#3d2c1a] transition-colors duration-200 group"
                aria-label={`Get directions to ${STORE_INFO.address.full}`}
              >
                <MapPin
                  size={13}
                  className="text-[#c49335]/60 flex-shrink-0 mt-0.5 group-hover:text-[#c49335] transition-colors"
                  aria-hidden="true"
                />
                <span>
                  {STORE_INFO.address.street}
                  <br />
                  {STORE_INFO.address.city}, {STORE_INFO.address.state}{" "}
                  {STORE_INFO.address.zip}
                </span>
              </a>
            </address>

          </div>
        </div>
      </div>
    </footer>
  );
}
