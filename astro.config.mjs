import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), react(), sitemap({
    filter: (page) => !page.includes('/katas/'),
  })],
  site: "https://www.aitorevi.dev/",
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
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