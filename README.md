# Jerry's Warehouse — Thrift Store Website

A complete, production-grade website for Jerry's Warehouse thrift store in Worcester, MA.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **Lucide React** icons
- Google Fonts: Playfair Display + DM Sans

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
jerrys-warehouse/
├── app/
│   ├── globals.css          # Global styles, CSS variables, animations
│   ├── layout.tsx           # Root layout with metadata & JSON-LD schema
│   └── page.tsx             # Home page (assembles all sections)
├── components/
│   └── sections/
│       ├── Navbar.tsx        # Sticky nav with scroll-aware styling
│       ├── Hero.tsx          # Full-viewport hero with entrance animation
│       ├── Categories.tsx    # 8-category grid
│       ├── WhyUs.tsx         # 3 value propositions
│       ├── HoursLocation.tsx # Hours table + Google Maps embed
│       ├── DonationsCTA.tsx  # Donations call-to-action
│       └── Footer.tsx        # Footer with address, social links
├── lib/
│   ├── constants.ts          # ALL text content and config
│   └── types.ts              # TypeScript interfaces
├── public/
│   └── images/
│       └── hero-bg.jpg       # ← ADD YOUR HERO IMAGE HERE
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Hero Image

Place your store's hero background image at:

```
public/images/hero-bg.jpg
```

A warm, atmospheric photo of the store interior works best. Minimum recommended size: **1920×1080px**.

If no image is provided, the hero will display with a dark charcoal background — still looks great with the overlay.

## Content Editing

**All text content is centralized in `lib/constants.ts`** — no hunting through components:

| Constant | What it controls |
|----------|-----------------|
| `STORE_INFO` | Name, address, phone, email, map URL |
| `STORE_HOURS` | All 7 days of hours |
| `CATEGORIES` | Category cards (title, description, icon) |
| `VALUE_PROPS` | "Why Us" section cards |
| `DONATIONS` | Donations section copy |
| `HERO` | Hero headline, tagline, CTAs |
| `NAV_LINKS` | Navigation links |
| `SOCIAL_LINKS` | Social media handles & URLs |
| `META` | SEO title, description, OG image |
| `FOOTER` | Footer tagline, copyright, hours summary |

## Design System

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#0f0d0b` | Main background |
| `--bg-soft` | `#1a1612` | Slightly lighter bg |
| `--bg-card` | `#1e1a14` | Card backgrounds |
| `--amber` | `#d4a853` | Primary accent / CTA |
| `--amber-light` | `#e8c278` | Hover states |
| `--cream` | `#f5eed8` | Primary text |
| `--cream-muted` | `#c9bfa0` | Secondary text |
| `--cream-dim` | `#8a7d63` | Tertiary / muted text |

### Typography
- **Display / Headings**: Playfair Display (serif)
- **Body / UI**: DM Sans (sans-serif)

## Features

- ✅ **Responsive** — mobile-first, tested at all breakpoints
- ✅ **Accessible** — semantic HTML, ARIA labels, keyboard navigable, WCAG 2.1 AA contrast
- ✅ **SEO** — Open Graph meta tags, JSON-LD LocalBusiness schema
- ✅ **Performance** — static generation, lazy-loaded map, optimized fonts
- ✅ **Reduced motion** — all animations respect `prefers-reduced-motion`
- ✅ **Today's hours** — dynamically highlights the current day in the hours table
- ✅ **Smooth scroll** — all nav links use smooth scrolling
- ✅ **Grain texture** — subtle noise overlay on hero for atmosphere
- ✅ **Scroll animations** — cards animate in as they enter the viewport

## Google Maps

The map embed uses a public API key placeholder. For production:

1. Get a Google Maps Embed API key from [Google Cloud Console](https://console.cloud.google.com)
2. Update `STORE_INFO.mapEmbedUrl` in `lib/constants.ts` with your actual embed URL

## Build for Production

```bash
npm run build
npm start
```

## Updating Store Hours

Edit `STORE_HOURS` in `lib/constants.ts`:

```ts
{ day: "Monday", open: null, close: null, closed: true },
{ day: "Tuesday", open: "12:00 PM", close: "7:00 PM", closed: false },
// ...
```

Set `closed: true` for days the store is closed. The JSON-LD schema will also need to be updated in `app/layout.tsx` if hours change significantly.
