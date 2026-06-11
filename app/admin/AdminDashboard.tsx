"use client";

import { useState } from "react";
import { saveSection, signOut } from "./actions";
import type { HeroContent, AboutContent } from "@/lib/content";

type Tab = "hero" | "about";

const SECTIONS: { id: Tab; label: string; desc: string }[] = [
  { id: "hero", label: "Hero", desc: "Top-of-page headline & tagline" },
  { id: "about", label: "About", desc: "Our Story paragraphs" },
];

export default function AdminDashboard({
  email,
  hero,
  about,
}: {
  email: string;
  hero: HeroContent;
  about: AboutContent;
}) {
  const [tab, setTab] = useState<Tab>("hero");
  const [heroForm, setHeroForm] = useState<HeroContent>(hero);
  const [aboutForm, setAboutForm] = useState<AboutContent>(about);
  const [saving, setSaving] = useState<Tab | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function save(section: Tab, data: Record<string, unknown>) {
    setSaving(section);
    setStatus(null);
    const res = await saveSection(section, data);
    setSaving(null);
    setStatus(
      res.ok
        ? { ok: true, msg: "Saved — the live site will update shortly." }
        : { ok: false, msg: res.error }
    );
  }

  const labelCls = "block text-sm font-medium text-[#4a2c0a] mb-2";
  const inputCls =
    "w-full bg-transparent border border-[#e8d8c0] rounded-lg px-4 py-3 text-sm text-[#4a2c0a] placeholder-[#9a6840]/70 focus:border-[#c49335] focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#faf6ed] text-[#4a2c0a]">
      {/* Top bar */}
      <header className="border-b border-[#e8d8c0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="leading-none">
            <span className="font-serif text-2xl font-bold text-[#c49335]">
              Jerry&apos;s
            </span>
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-[#9a6840] ml-2">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-[#9a6840]">{email}</span>
            <a
              href="/"
              target="_blank"
              className="text-sm text-[#6e4218] hover:text-[#c49335] transition-colors"
            >
              View site ↗
            </a>
            <form action={signOut}>
              <button className="text-sm font-medium text-[#6e4218] hover:text-[#c49335] transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        {/* Section nav */}
        <nav className="flex md:flex-col gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setTab(s.id);
                setStatus(null);
              }}
              className={`text-left px-4 py-3 rounded-lg transition-colors ${
                tab === s.id
                  ? "bg-[#c49335] text-white"
                  : "bg-white border border-[#e8d8c0] text-[#4a2c0a] hover:border-[#c49335]/40"
              }`}
            >
              <span className="block text-sm font-semibold">{s.label}</span>
              <span
                className={`block text-xs mt-0.5 ${
                  tab === s.id ? "text-white/80" : "text-[#9a6840]"
                }`}
              >
                {s.desc}
              </span>
            </button>
          ))}
        </nav>

        {/* Editor panel */}
        <div className="bg-white border border-[#e8d8c0] rounded-xl p-6 md:p-8">
          {tab === "hero" && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-bold">Hero</h2>
              <div>
                <label className={labelCls} htmlFor="hero-headline">
                  Headline{" "}
                  <span className="text-[#9a6840] font-normal">
                    (use a line break for two lines)
                  </span>
                </label>
                <textarea
                  id="hero-headline"
                  rows={2}
                  value={heroForm.headline}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, headline: e.target.value })
                  }
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="hero-tagline">
                  Tagline
                </label>
                <input
                  id="hero-tagline"
                  value={heroForm.tagline}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, tagline: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <SaveRow
                saving={saving === "hero"}
                status={status}
                onSave={() => save("hero", heroForm)}
              />
            </div>
          )}

          {tab === "about" && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-bold">About — Our Story</h2>
              {(["paragraph1", "paragraph2", "paragraph3"] as const).map((key, i) => (
                <div key={key}>
                  <label className={labelCls} htmlFor={key}>
                    Paragraph {i + 1}
                  </label>
                  <textarea
                    id={key}
                    rows={4}
                    value={aboutForm[key]}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, [key]: e.target.value })
                    }
                    className={`${inputCls} resize-none`}
                  />
                </div>
              ))}
              <SaveRow
                saving={saving === "about"}
                status={status}
                onSave={() => save("about", aboutForm)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SaveRow({
  saving,
  status,
  onSave,
}: {
  saving: boolean;
  status: { ok: boolean; msg: string } | null;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm rounded-lg px-6 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      {status && (
        <span
          className={`text-sm ${status.ok ? "text-green-700" : "text-red-600"}`}
        >
          {status.msg}
        </span>
      )}
    </div>
  );
}
