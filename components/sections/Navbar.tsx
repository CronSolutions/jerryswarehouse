"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { STORE_INFO, NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

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
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled || isOpen
          ? "bg-[#faf6ed] backdrop-blur-md border-b border-[#d9cdb8] py-3"
          : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className={`font-serif text-sm tracking-[0.25em] uppercase transition-colors duration-300 ${scrolled || isOpen ? "text-[#9a7f6a] group-hover:text-[#6b5444]" : "text-[#c9bfa0] group-hover:text-[#f5eed8]"}`}>
              Warehouse
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="text-xl font-medium transition-colors duration-200 tracking-wide text-[#c9bfa0] hover:text-[#d4a853]"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href="tel:+15085550192"
            className="hidden md:flex items-center gap-2 text-md font-semibold text-[#faf6ed] bg-[#c49335] hover:bg-[#d4a853] px-4 py-2 rounded transition-colors duration-200"
            aria-label={`Call us at ${STORE_INFO.phone}`}
          >
            {STORE_INFO.phone}
          </a>

          {/* Mobile toggle */}
          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${scrolled || isOpen ? "text-[#6b5444] hover:text-[#c49335]" : "text-[#c9bfa0] hover:text-[#d4a853]"}`}
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
                  className="w-full text-left px-4 py-3.5 text-[#3d2c1a] hover:text-[#c49335] hover:bg-[#ede6d7] rounded-lg transition-colors duration-200 text-base font-medium"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-4 border-t border-[#d9cdb8]">
            <a
              href="tel:+15085550192"
              className="block text-center text-sm font-semibold text-[#faf6ed] bg-[#c49335] hover:bg-[#d4a853] px-4 py-3.5 rounded-lg transition-colors duration-200"
            >
              {STORE_INFO.phone}
            </a>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
