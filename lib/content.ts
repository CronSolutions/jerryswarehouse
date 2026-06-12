import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import {
  HERO,
  VALUE_PROPS,
  STORE_INFO,
  STORE_HOURS,
  SOCIAL_LINKS,
  FOOTER,
  EBAY_URL,
  MARQUEE_ITEMS,
  REVIEWS,
} from "@/lib/constants";

// Tag used to invalidate all cached content when the admin saves.
export const CONTENT_TAG = "site-content";

// ─── Section shapes ──────────────────────────────────────────────────────────
export type HeroContent = { headline: string; tagline: string };
export type AboutContent = {
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
};
export type StoreInfoContent = {
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  ebayUrl: string;
};
export type HoursDay = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};
export type HoursContent = { days: HoursDay[] };
export type ValuePropItem = { title: string; description: string };
export type ValuePropsContent = {
  headingLead: string;
  headingAccent: string;
  items: ValuePropItem[];
};
export type ReviewItem = {
  name: string;
  rating: number;
  text: string;
  timeAgo: string;
};
export type ReviewsContent = {
  headingLead: string;
  headingAccent: string;
  items: ReviewItem[];
};
export type CategoriesContent = { items: string[] };
export type MediaContent = { hero: string; about: string; whyUs: string };

/** Bundled fallback image paths (used until the admin uploads a replacement). */
export const DEFAULT_MEDIA = {
  hero: "/images/hero-bg.webp",
  about: "/images/about.webp",
  whyUs: "/images/why-us.webp",
};
export type FooterContent = {
  tagline: string;
  instagramHandle: string;
  instagramUrl: string;
  ebayUrl: string;
};

// ─── Defaults (used when a row is missing or Supabase is unreachable) ─────────
export const CONTENT_DEFAULTS = {
  hero: { headline: HERO.headline, tagline: HERO.tagline } as HeroContent,
  about: {
    paragraph1:
      "What started as a small vintage spot has grown into one of Worcester's most-loved hidden gems. Jerry's Warehouse is built on a simple idea — that great things deserve a second life, and everyone deserves the thrill of the find.",
    paragraph2:
      "Every rack and shelf is hand-curated, from 90s denim and band tees to one-of-a-kind furniture and collectibles. New treasures arrive constantly, so no two visits are ever the same.",
    paragraph3:
      "More than a store, it's a community — a place to dig, to discover, and to leave with something that feels like it was waiting just for you.",
  } as AboutContent,
  store_info: {
    phone: STORE_INFO.phone,
    email: STORE_INFO.email,
    street: STORE_INFO.address.street,
    city: STORE_INFO.address.city,
    state: STORE_INFO.address.state,
    zip: STORE_INFO.address.zip,
    ebayUrl: EBAY_URL,
  } as StoreInfoContent,
  hours: {
    days: STORE_HOURS.map((h) => ({
      day: h.day,
      open: h.open ?? "",
      close: h.close ?? "",
      closed: h.closed,
    })),
  } as HoursContent,
  value_props: {
    headingLead: "The Jerry's",
    headingAccent: "Difference",
    items: VALUE_PROPS.map((v) => ({
      title: v.title,
      description: v.description,
    })),
  } as ValuePropsContent,
  reviews: {
    headingLead: "Loved by",
    headingAccent: "Worcester",
    items: REVIEWS,
  } as ReviewsContent,
  categories: { items: MARQUEE_ITEMS } as CategoriesContent,
  // Empty string = use the bundled default image.
  media: { hero: "", about: "", whyUs: "" } as MediaContent,
  footer: {
    tagline: FOOTER.tagline,
    instagramHandle: SOCIAL_LINKS[0].handle,
    instagramUrl: SOCIAL_LINKS[0].url,
    ebayUrl: EBAY_URL,
  } as FooterContent,
};

// ─── Cached low-level fetch ──────────────────────────────────────────────────
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

async function read<T>(section: string, fallback: T): Promise<T> {
  const data = await getSection(section);
  return { ...fallback, ...(data as Partial<T> | null) };
}

// ─── Public getters ──────────────────────────────────────────────────────────
export const getHero = () => read("hero", CONTENT_DEFAULTS.hero);
export const getAbout = () => read("about", CONTENT_DEFAULTS.about);
export const getStoreInfo = () => read("store_info", CONTENT_DEFAULTS.store_info);
export const getHours = () => read("hours", CONTENT_DEFAULTS.hours);
export const getValueProps = () => read("value_props", CONTENT_DEFAULTS.value_props);
export const getReviews = () => read("reviews", CONTENT_DEFAULTS.reviews);
export const getCategories = () => read("categories", CONTENT_DEFAULTS.categories);
export const getFooter = () => read("footer", CONTENT_DEFAULTS.footer);
export const getMedia = () => read("media", CONTENT_DEFAULTS.media);

/** Resolve a stored media path (in the product-images bucket) or fall back. */
export function mediaSrc(path: string, fallback: string): string {
  if (!path) return fallback;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/product-images/${path}`;
}
