"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "./actions";

const LINKS = [
  { href: "/admin", label: "Site Text" },
  { href: "/admin/products", label: "Shop" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/", label: "View Site ↗", external: true },
];

export default function AdminNav({
  email,
  subtitle,
}: {
  email: string;
  subtitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#f5ede0] backdrop-blur-md border-b border-[#e8d8c0]">
      <div className="max-w-6xl mx-auto px-6">
        <nav
          aria-label="Admin navigation"
          className="flex items-center justify-between py-3"
        >
          {/* Logo */}
          <a href="/admin" className="flex flex-col leading-none group">
            <span className="font-serif text-3xl font-bold text-[#c49335] group-hover:text-[#d4a853] transition-colors duration-300">
              Jerry&apos;s
            </span>
            <span className="font-serif text-sm tracking-[0.25em] uppercase text-[#9a6840]">
              {subtitle}
            </span>
          </a>

          {/* Desktop nav + sign out */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex items-center gap-6 lg:gap-8" role="list">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    className="text-base lg:text-lg font-semibold tracking-wide text-[#4a2c0a] hover:text-[#c49335] transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <form action={signOut}>
              <button className="text-base lg:text-lg font-semibold text-white bg-[#c49335] hover:bg-[#d4a853] px-4 py-2 rounded transition-colors duration-200">
                Sign out
              </button>
            </form>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#4a2c0a] hover:text-[#c49335] transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div
          className={`overflow-hidden transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 pt-2 pb-6">
            <ul className="space-y-1" role="list">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3.5 text-[#4a2c0a] hover:text-[#c49335] hover:bg-[#ede6d7] rounded-lg transition-colors duration-200 text-base font-medium"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-4 border-t border-[#e8d8c0]">
              <p className="px-4 mb-3 text-xs text-[#9a6840] truncate">{email}</p>
              <form action={signOut}>
                <button className="block w-full text-center text-sm font-semibold text-white bg-[#c49335] hover:bg-[#d4a853] px-4 py-3.5 rounded-lg transition-colors duration-200">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
