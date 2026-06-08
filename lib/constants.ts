import type {
  StoreHours,
  CategoryItem,
  ValueProp,
  SocialLink,
  StoreInfo,
  MetaInfo,
} from "./types";

// ─── Store Info ───────────────────────────────────────────────────────────────

export const STORE_INFO: StoreInfo = {
  name: "Jerry's Warehouse",
  tagline: "Worcester's Hidden Gem for Unique Finds",
  address: {
    street: "123 Highland Street",
    city: "Worcester",
    state: "MA",
    zip: "01606",
    full: "123 Highland Street, Worcester, MA 01606",
  },
  phone: "(508) 555-0192",
  email: "hello@jerryswarehouse.com",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2951.3!2d-71.8023!3d42.2626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s123+Highland+St%2C+Worcester%2C+MA+01606!5e0!3m2!1sen!2sus!4v1600000000000",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=123+Highland+St,+Worcester,+MA+01606",
};

// ─── Hours ────────────────────────────────────────────────────────────────────

export const STORE_HOURS: StoreHours[] = [
  { day: "Monday", open: null, close: null, closed: true },
  { day: "Tuesday", open: "12:00 PM", close: "7:00 PM", closed: false },
  { day: "Wednesday", open: "12:00 PM", close: "7:00 PM", closed: false },
  { day: "Thursday", open: "12:00 PM", close: "7:00 PM", closed: false },
  { day: "Friday", open: "12:00 PM", close: "7:00 PM", closed: false },
  { day: "Saturday", open: "12:00 PM", close: "7:00 PM", closed: false },
  { day: "Sunday", open: "12:00 PM", close: "5:00 PM", closed: false },
];

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES: CategoryItem[] = [
  {
    id: "clothing",
    title: "Clothing & Apparel",
    description:
      "Vintage threads, designer finds, and everyday essentials at prices that'll surprise you.",
    iconName: "Shirt",
  },
  {
    id: "furniture",
    title: "Furniture",
    description:
      "From mid-century modern to rustic charm — statement pieces for every room.",
    iconName: "Sofa",
  },
  {
    id: "electronics",
    title: "Electronics",
    description:
      "Cameras, audio gear, gadgets, and retro tech waiting for a second life.",
    iconName: "Tv",
  },
  {
    id: "books",
    title: "Books & Media",
    description:
      "Thousands of books, vinyl records, DVDs, and games to explore and discover.",
    iconName: "BookOpen",
  },
  {
    id: "home-goods",
    title: "Home Goods",
    description:
      "Kitchenware, décor, linens, and everything you need to make a house a home.",
    iconName: "Home",
  },
  {
    id: "collectibles",
    title: "Collectibles & Vintage",
    description:
      "Antiques, memorabilia, and one-of-a-kind treasures for the discerning collector.",
    iconName: "Gem",
  },
  {
    id: "shoes",
    title: "Shoes & Accessories",
    description:
      "Boots, sneakers, handbags, jewelry, and belts — complete your look for less.",
    iconName: "ShoppingBag",
  },
  {
    id: "toys",
    title: "Toys & Games",
    description:
      "Board games, action figures, puzzles, and childhood classics for all ages.",
    iconName: "Gamepad2",
  },
];

// ─── Value Props ──────────────────────────────────────────────────────────────

export const VALUE_PROPS: ValueProp[] = [
  {
    id: "rotating",
    title: "Constantly Rotating Stock",
    description:
      "New donations arrive every single day. No two visits are alike — the thrill of the hunt is always real at Jerry's.",
    iconName: "RefreshCw",
  },
  {
    id: "prices",
    title: "Unbeatable Prices",
    description:
      "Save up to 90% off retail on clothing, furniture, and more. Your dollar goes further here than anywhere else in Worcester.",
    iconName: "Tag",
  },
  {
    id: "unique",
    title: "Unique & One-of-a-Kind Finds",
    description:
      "You won't find these items at the mall. Every piece has a story, and it's waiting for you to write the next chapter.",
    iconName: "Sparkles",
  },
];

// ─── Donations ────────────────────────────────────────────────────────────────

export const DONATIONS = {
  headline: "Give Your Items a New Home",
  subheadline: "Your donations make the magic happen.",
  body: "Every item you donate becomes someone else's treasure. We accept clothing, furniture, housewares, electronics, books, and more. Drop off anytime during store hours — no appointment needed. Together, we keep great things out of landfills and in the hands of people who'll love them.",
  ctaText: "Learn About Donations",
  ctaHref: "#location",
  statsLabel: "Families helped annually through affordable thrift",
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const HERO = {
  eyebrow: "Worcester's Premier Thrift Destination",
  headline: "Jerry's\nWarehouse",
  tagline: "Worcester's Hidden Gem for Unique Finds",
  cta1: { label: "Visit Us Today", href: "#location" },
  cta2: { label: "See What's In Store", href: "#categories" },
};

// ─── Social Links ─────────────────────────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Instagram",
    handle: "@jerrys_warehouse",
    url: "https://instagram.com/jerrys_warehouse",
    ariaLabel: "Follow Jerry's Warehouse on Instagram",
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const META: MetaInfo = {
  title: "Jerry's Warehouse — Thrift Store in Worcester, MA",
  description:
    "Worcester's hidden gem for unique finds. Thrift store at 123 Highland Street with clothing, furniture, electronics, collectibles & more. Tue–Sat 12–7 PM, Sun 12–5 PM.",
  url: "https://jerryswarehouse.com",
  ogImage: "/images/og-image.jpg",
};

// ─── Nav ──────────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "HOME", href: "#hero" },
  { label: "ABOUT", href: "#about" },
  { label: "WHY US", href: "#why-us" },
  { label: "LOCATE", href: "#location" },
  { label: "CONTACT", href: "#contact" },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FOOTER = {
  tagline: "Every visit is a new adventure.",
  copyright: `© ${new Date().getFullYear()} Jerry's Warehouse. All rights reserved.`,
  hoursSummary: "Tue–Sat: 12–7 PM  ·  Sun: 12–5 PM  ·  Mon: Closed",
};
