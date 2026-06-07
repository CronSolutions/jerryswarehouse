import type { Metadata } from "next";
import "./globals.css";
import { META, STORE_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  metadataBase: new URL(META.url),
  openGraph: {
    type: "website",
    url: META.url,
    title: META.title,
    description: META.description,
    siteName: STORE_INFO.name,
    images: [
      {
        url: META.ogImage,
        width: 1200,
        height: 630,
        alt: `${STORE_INFO.name} — Thrift Store in Worcester, MA`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.description,
    images: [META.ogImage],
  },
  alternates: {
    canonical: META.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ThriftStore",
  name: STORE_INFO.name,
  description: META.description,
  url: META.url,
  telephone: STORE_INFO.phone,
  email: STORE_INFO.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE_INFO.address.street,
    addressLocality: STORE_INFO.address.city,
    addressRegion: STORE_INFO.address.state,
    postalCode: STORE_INFO.address.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 42.2626,
    longitude: -71.8023,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "12:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "12:00",
      closes: "17:00",
    },
  ],
  priceRange: "$",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#0f0d0b] text-[#f5eed8] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
