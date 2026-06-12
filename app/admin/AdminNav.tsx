"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "./actions";

const LINKS = [
  { href: "/admin", label: "Site text" },
  { href: "/admin/products", label: "Shop" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminNav({
  email,
  subtitle,
}: {
  email: string;
  subtitle: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#e8d8c0] bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <a href="/admin" className="leading-none">
          <span className="font-serif text-2xl font-bold text-[#c49335]">
            Jerry&apos;s
          </span>
          <span className="font-serif text-xs tracking-[0.3em] uppercase text-[#9a6840] ml-2">
            {subtitle}
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <span className="text-xs text-[#9a6840]">{email}</span>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[#6e4218] hover:text-[#c49335] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/"
            target="_blank"
            className="text-[#6e4218] hover:text-[#c49335] transition-colors"
          >
            View site ↗
          </a>
          <form action={signOut}>
            <button className="font-medium text-[#6e4218] hover:text-[#c49335] transition-colors">
              Sign out
            </button>
          </form>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[#4a2c0a]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className="md:hidden grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-4 pt-2 border-t border-[#e8d8c0] flex flex-col">
            <span className="text-xs text-[#9a6840] py-1">{email}</span>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="py-2.5 text-sm text-[#4a2c0a] hover:text-[#c49335] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/"
              target="_blank"
              className="py-2.5 text-sm text-[#4a2c0a] hover:text-[#c49335] transition-colors"
            >
              View site ↗
            </a>
            <form action={signOut}>
              <button className="py-2.5 text-sm font-medium text-[#4a2c0a] hover:text-[#c49335] transition-colors text-left">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
