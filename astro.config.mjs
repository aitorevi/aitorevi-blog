import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import keystatic from "@keystatic/astro";

// Keystatic only in dev: the integrator injects a shared CSS chunk
// that Astro links on every page, adding ~12.9 KB of render-blocking
// CSS that the public site never needs. Edit content via
// `npm run dev` → http://localhost:4321/keystatic. See issue for a
// permanent fix path.
const isDev = process.env.NODE_ENV !== 'production';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [
    tailwind(),
    icon(),
    react(),
    ...(isDev ? [keystatic()] : []),
    sitemap({
      filter: (page) => !page.includes('/print') && !page.includes('/keystatic'),
    }),
  ],
  site: "https://www.aitorevi.dev/",
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
    '/cv/en': '/en/cv',
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});