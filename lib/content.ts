import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { HERO } from "@/lib/constants";

// Tag used to invalidate all cached content when the admin saves.
export const CONTENT_TAG = "site-content";

// ─── Section shapes ──────────────────────────────────────────────────────────
export type HeroContent = { headline: string; tagline: string };
export type AboutContent = {
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
};

// Defaults used when a row is missing or Supabase is unreachable.
const DEFAULTS = {
  hero: { headline: HERO.headline, tagline: HERO.tagline } as HeroContent,
  about: {
    paragraph1:
      "What started as a small vintage spot has grown into one of Worcester's most-loved hidden gems. Jerry's Warehouse is built on a simple idea — that great things deserve a second life, and everyone deserves the thrill of the find.",
    paragraph2:
      "Every rack and shelf is hand-curated, from 90s denim and band tees to one-of-a-kind furniture and collectibles. New treasures arrive constantly, so no two visits are ever the same.",
    paragraph3:
      "More than a store, it's a community — a place to dig, to discover, and to leave with something that feels like it was waiting just for you.",
  } as AboutContent,
};

/** Low-level cached fetch of one section's JSON. */
const getSection = unstable_cache(
  async (section: string) => {
    const client = supabasePublic;
    if (!client) return null; // env not configured → use defaults
    const { data, error } = await client
      .from("content")
      .select("data")
      .eq("section", section)
      .maybeSingle();
    if (error) return null;
    return (data?.data as Record<string, unknown>) ?? null;
  },
  ["site-content"],
  { tags: [CONTENT_TAG], revalidate: 3600 }
);

export async function getHero(): Promise<HeroContent> {
  const data = await getSection("hero");
  return { ...DEFAULTS.hero, ...(data as Partial<HeroContent> | null) };
}

export async function getAbout(): Promise<AboutContent> {
  const data = await getSection("about");
  return { ...DEFAULTS.about, ...(data as Partial<AboutContent> | null) };
}

export const CONTENT_DEFAULTS = DEFAULTS;
