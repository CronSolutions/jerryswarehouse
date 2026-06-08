// Prefix for static assets in `public/`. On GitHub Pages the site is served
// from `/<repo>`, but next/image (unoptimized) does NOT auto-prepend basePath
// to public/ image src values — so we do it manually here.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const asset = (path: string) => `${basePath}${path}`;
