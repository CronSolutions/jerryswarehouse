"use client";

import { useState } from "react";
import { saveSection, signOut } from "./actions";
import type {
  HeroContent,
  AboutContent,
  StoreInfoContent,
  HoursContent,
  ValuePropsContent,
  ReviewsContent,
  CategoriesContent,
  FooterContent,
} from "@/lib/content";

type ContentBundle = {
  hero: HeroContent;
  about: AboutContent;
  store_info: StoreInfoContent;
  hours: HoursContent;
  value_props: ValuePropsContent;
  reviews: ReviewsContent;
  categories: CategoriesContent;
  footer: FooterContent;
};

type SectionId = keyof ContentBundle;

const SECTIONS: { id: SectionId; label: string; desc: string }[] = [
  { id: "hero", label: "Hero", desc: "Headline & tagline" },
  { id: "about", label: "About", desc: "Our Story paragraphs" },
  { id: "store_info", label: "Store Info", desc: "Address, phone, links" },
  { id: "hours", label: "Hours", desc: "Opening times" },
  { id: "value_props", label: "Why Us", desc: "The Jerry's Difference" },
  { id: "reviews", label: "Reviews", desc: "Customer reviews" },
  { id: "categories", label: "Categories", desc: "Scrolling marquee words" },
  { id: "footer", label: "Footer", desc: "Tagline & social links" },
];

const labelCls = "block text-sm font-medium text-[#4a2c0a] mb-2";
const inputCls =
  "w-full bg-transparent border border-[#e8d8c0] rounded-lg px-4 py-2.5 text-sm text-[#4a2c0a] placeholder-[#9a6840]/70 focus:border-[#c49335] focus:outline-none transition-colors";

export default function AdminDashboard({
  email,
  content,
}: {
  email: string;
  content: ContentBundle;
}) {
  const [tab, setTab] = useState<SectionId>("hero");
  const [forms, setForms] = useState<ContentBundle>(content);
  const [saving, setSaving] = useState<SectionId | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  function update<K extends SectionId>(section: K, value: ContentBundle[K]) {
    setForms((f) => ({ ...f, [section]: value }));
  }

  async function save(section: SectionId) {
    setSaving(section);
    setStatus(null);
    const res = await saveSection(
      section,
      forms[section] as unknown as Record<string, unknown>
    );
    setSaving(null);
    setStatus(
      res.ok
        ? { ok: true, msg: "Saved — the live site will update shortly." }
        : { ok: false, msg: res.error }
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6ed] text-[#4a2c0a]">
      {/* Top bar */}
      <header className="border-b border-[#e8d8c0] bg-white sticky top-0 z-10">
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

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[210px_1fr] gap-8">
        {/* Section nav */}
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setTab(s.id);
                setStatus(null);
              }}
              className={`text-left px-4 py-3 rounded-lg shrink-0 transition-colors ${
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
            <Panel title="Hero">
              <Field
                label="Headline"
                hint="(use a line break for two lines)"
                textarea
                rows={2}
                value={forms.hero.headline}
                onChange={(v) => update("hero", { ...forms.hero, headline: v })}
              />
              <Field
                label="Tagline"
                value={forms.hero.tagline}
                onChange={(v) => update("hero", { ...forms.hero, tagline: v })}
              />
            </Panel>
          )}

          {tab === "about" && (
            <Panel title="About — Our Story">
              {(["paragraph1", "paragraph2", "paragraph3"] as const).map((k, i) => (
                <Field
                  key={k}
                  label={`Paragraph ${i + 1}`}
                  textarea
                  rows={4}
                  value={forms.about[k]}
                  onChange={(v) => update("about", { ...forms.about, [k]: v })}
                />
              ))}
            </Panel>
          )}

          {tab === "store_info" && (
            <Panel title="Store Info">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Phone"
                  value={forms.store_info.phone}
                  onChange={(v) => update("store_info", { ...forms.store_info, phone: v })}
                />
                <Field
                  label="Email"
                  value={forms.store_info.email}
                  onChange={(v) => update("store_info", { ...forms.store_info, email: v })}
                />
              </div>
              <Field
                label="Street"
                value={forms.store_info.street}
                onChange={(v) => update("store_info", { ...forms.store_info, street: v })}
              />
              <div className="grid grid-cols-3 gap-4">
                <Field
                  label="City"
                  value={forms.store_info.city}
                  onChange={(v) => update("store_info", { ...forms.store_info, city: v })}
                />
                <Field
                  label="State"
                  value={forms.store_info.state}
                  onChange={(v) => update("store_info", { ...forms.store_info, state: v })}
                />
                <Field
                  label="ZIP"
                  value={forms.store_info.zip}
                  onChange={(v) => update("store_info", { ...forms.store_info, zip: v })}
                />
              </div>
              <Field
                label="eBay store URL"
                value={forms.store_info.ebayUrl}
                onChange={(v) => update("store_info", { ...forms.store_info, ebayUrl: v })}
              />
            </Panel>
          )}

          {tab === "hours" && (
            <Panel title="Store Hours">
              <div className="space-y-3">
                {forms.hours.days.map((day, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium">{day.day}</span>
                    <label className="flex items-center gap-1.5 text-sm text-[#6e4218]">
                      <input
                        type="checkbox"
                        checked={day.closed}
                        onChange={(e) => {
                          const days = [...forms.hours.days];
                          days[i] = { ...day, closed: e.target.checked };
                          update("hours", { days });
                        }}
                      />
                      Closed
                    </label>
                    {!day.closed && (
                      <>
                        <input
                          value={day.open}
                          placeholder="12:00 PM"
                          onChange={(e) => {
                            const days = [...forms.hours.days];
                            days[i] = { ...day, open: e.target.value };
                            update("hours", { days });
                          }}
                          className={`${inputCls} max-w-[120px]`}
                        />
                        <span className="text-[#9a6840]">–</span>
                        <input
                          value={day.close}
                          placeholder="7:00 PM"
                          onChange={(e) => {
                            const days = [...forms.hours.days];
                            days[i] = { ...day, close: e.target.value };
                            update("hours", { days });
                          }}
                          className={`${inputCls} max-w-[120px]`}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {tab === "value_props" && (
            <Panel title="Why Us — The Jerry's Difference">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Heading (lead)"
                  value={forms.value_props.headingLead}
                  onChange={(v) =>
                    update("value_props", { ...forms.value_props, headingLead: v })
                  }
                />
                <Field
                  label="Heading (accent, gold)"
                  value={forms.value_props.headingAccent}
                  onChange={(v) =>
                    update("value_props", { ...forms.value_props, headingAccent: v })
                  }
                />
              </div>
              <ListEditor
                items={forms.value_props.items}
                onChange={(items) =>
                  update("value_props", { ...forms.value_props, items })
                }
                blank={{ title: "", description: "" }}
                addLabel="Add value prop"
                render={(item, set) => (
                  <>
                    <Field
                      label="Title"
                      value={item.title}
                      onChange={(v) => set({ ...item, title: v })}
                    />
                    <Field
                      label="Description"
                      textarea
                      rows={3}
                      value={item.description}
                      onChange={(v) => set({ ...item, description: v })}
                    />
                  </>
                )}
              />
            </Panel>
          )}

          {tab === "reviews" && (
            <Panel title="Customer Reviews">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Heading (lead)"
                  value={forms.reviews.headingLead}
                  onChange={(v) => update("reviews", { ...forms.reviews, headingLead: v })}
                />
                <Field
                  label="Heading (accent, gold)"
                  value={forms.reviews.headingAccent}
                  onChange={(v) =>
                    update("reviews", { ...forms.reviews, headingAccent: v })
                  }
                />
              </div>
              <ListEditor
                items={forms.reviews.items}
                onChange={(items) => update("reviews", { ...forms.reviews, items })}
                blank={{ name: "", rating: 5, text: "", timeAgo: "" }}
                addLabel="Add review"
                render={(item, set) => (
                  <>
                    <div className="grid grid-cols-[1fr_90px_1fr] gap-3">
                      <Field
                        label="Name"
                        value={item.name}
                        onChange={(v) => set({ ...item, name: v })}
                      />
                      <Field
                        label="Stars"
                        value={String(item.rating)}
                        onChange={(v) =>
                          set({ ...item, rating: Math.max(1, Math.min(5, Number(v) || 5)) })
                        }
                      />
                      <Field
                        label="Time ago"
                        value={item.timeAgo}
                        onChange={(v) => set({ ...item, timeAgo: v })}
                      />
                    </div>
                    <Field
                      label="Review text"
                      textarea
                      rows={3}
                      value={item.text}
                      onChange={(v) => set({ ...item, text: v })}
                    />
                  </>
                )}
              />
            </Panel>
          )}

          {tab === "categories" && (
            <Panel title="Categories — Scrolling Marquee">
              <ListEditor
                items={forms.categories.items.map((t) => ({ text: t }))}
                onChange={(items) =>
                  update("categories", { items: items.map((i) => i.text) })
                }
                blank={{ text: "" }}
                addLabel="Add category"
                render={(item, set) => (
                  <Field
                    label="Category"
                    value={item.text}
                    onChange={(v) => set({ text: v })}
                  />
                )}
              />
            </Panel>
          )}

          {tab === "footer" && (
            <Panel title="Footer">
              <Field
                label="Tagline"
                value={forms.footer.tagline}
                onChange={(v) => update("footer", { ...forms.footer, tagline: v })}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Instagram handle"
                  value={forms.footer.instagramHandle}
                  onChange={(v) =>
                    update("footer", { ...forms.footer, instagramHandle: v })
                  }
                />
                <Field
                  label="Instagram URL"
                  value={forms.footer.instagramUrl}
                  onChange={(v) =>
                    update("footer", { ...forms.footer, instagramUrl: v })
                  }
                />
              </div>
              <Field
                label="eBay store URL"
                value={forms.footer.ebayUrl}
                onChange={(v) => update("footer", { ...forms.footer, ebayUrl: v })}
              />
            </Panel>
          )}

          <div className="flex items-center gap-4 pt-6 mt-6 border-t border-[#e8d8c0]">
            <button
              onClick={() => save(tab)}
              disabled={saving === tab}
              className="bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm rounded-lg px-6 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving === tab ? "Saving…" : "Save changes"}
            </button>
            {status && (
              <span className={`text-sm ${status.ok ? "text-green-700" : "text-red-600"}`}>
                {status.msg}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable pieces ─────────────────────────────────────────────────────────

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {hint && <span className="text-[#9a6840] font-normal"> {hint}</span>}
      </label>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </div>
  );
}

function ListEditor<T>({
  items,
  onChange,
  blank,
  addLabel,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: T;
  addLabel: string;
  render: (item: T, set: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="relative border border-[#e8d8c0] rounded-lg p-4 pt-9 space-y-3 bg-[#faf6ed]/50"
        >
          <span className="absolute top-2 left-3 text-xs font-medium text-[#9a6840]">
            #{i + 1}
          </span>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute top-2 right-3 text-xs font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
          {render(item, (next) =>
            onChange(items.map((it, j) => (j === i ? next : it)))
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, blank])}
        className="text-sm font-medium text-[#c49335] hover:underline"
      >
        + {addLabel}
      </button>
    </div>
  );
}
