"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { STORE_INFO, NAV_LINKS } from "@/lib/constants";
import { CONTENT_DEFAULTS, type StoreInfoContent } from "@/lib/content";

export default function Navbar({
  storeInfo,
  solid = false,
}: {
  storeInfo?: StoreInfoContent;
  solid?: boolean;
}) {
  const router = useRouter();
  const phone = (storeInfo ?? CONTENT_DEFAULTS.store_info).phone;
  const telHref = `tel:${phone.replace(/\D/g, "")}`;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Force the opaque/dark-text style on pages without a hero behind the bar.
  const solidBar = solid || scrolled || isOpen;

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY.current && y > 80) {
        setHidden(true);
        setIsOpen(false);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (href: string) => {
    setIsOpen(false);
    if (!href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Route links (e.g. /shop) navigate; hash links scroll, or jump home if the
    // target section isn't on the current page.
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else router.push(`/${href}`);
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        solidBar
          ? "bg-[#f5ede0] backdrop-blur-md border-b border-[#e8d8c0] py-3"
          : "bg-transparent py-3"
      }`}
    >
      <div className="px-6 sm:px-8 lg:px-[150px]">
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between"
        >
          {/* Logo */}
          <a
            href="#"
            className="flex flex-col leading-none group"
            aria-label={`${STORE_INFO.name} — home`}
          >
            <span className="font-serif text-3xl font-bold text-[#d4a853] group-hover:text-[#e8c278] transition-colors duration-300">
              Jerry&apos;s
            </span>
            <span className={`font-serif text-sm tracking-[0.25em] uppercase transition-colors duration-300 ${solidBar ? "text-[#6e4218] group-hover:text-[#4a2c0a]" : "text-[#c8a07a] group-hover:text-[#f5eed8]"}`}>
              Warehouse
            </span>
          </a>

          {/* Desktop nav + CTA grouped on the right */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex items-center gap-6 lg:gap-8" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className={`text-base lg:text-xl font-semibold transition-colors duration-200 tracking-wide hover:text-[#d4a853] ${solidBar ? "text-[#4a2c0a]" : "text-[#ffffff]"}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <a
              href={telHref}
              className="hidden lg:flex items-center gap-2 text-xl font-semibold text-[#ffffff] bg-[#c49335] hover:bg-[#d4a853] px-4 py-2 rounded transition-colors duration-200"
              aria-label={`Call us at ${phone}`}
            >
              {phone}
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${solidBar ? "text-[#4a2c0a] hover:text-[#c49335]" : "text-[#c8a07a] hover:text-[#d4a853]"}`}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className="md:hidden grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className={`overflow-hidden transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "opacity-100" : "opacity-0"}`}>
        <div className="px-4 pt-2 pb-6">
          <ul className="space-y-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="w-full text-left px-4 py-3.5 text-[#4a2c0a] hover:text-[#c49335] hover:bg-[#f5ede0] rounded-lg transition-colors duration-200 text-base font-medium"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-4 border-t border-[#e8d8c0]">
            <a
              href={telHref}
              className="block text-center text-sm font-semibold text-[#ffffff] bg-[#c49335] hover:bg-[#d4a853] px-4 py-3.5 rounded-lg transition-colors duration-200"
            >
              {phone}
            </a>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
