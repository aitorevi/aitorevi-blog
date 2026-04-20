import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [tailwind(), icon(), react(), keystatic(), sitemap({
    filter: (page) => !page.includes('/print') && !page.includes('/keystatic'),
  })],
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