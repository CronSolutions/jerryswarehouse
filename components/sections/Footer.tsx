import { Instagram, MapPin, ShoppingBag } from "lucide-react";
import { STORE_INFO, SOCIAL_LINKS, FOOTER, NAV_LINKS } from "@/lib/constants";
import ContactForm from "./ContactForm";

export default function Footer() {
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
              &ldquo;{FOOTER.tagline}&rdquo;
            </p>

            {/* Social */}
            <div className="flex flex-wrap items-center gap-3 mb-12">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="flex items-center gap-2 px-3 py-2 bg-[#ffffff] border border-[#e8d8c0] rounded-lg text-[#6e4218] hover:text-[#c49335] hover:border-[#c49335]/40 transition-all duration-200 text-xs font-medium"
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
                    href={STORE_INFO.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-[#6e4218] hover:text-[#4a2c0a] transition-colors duration-200 group"
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
      </div>
    </footer>
  );
}
