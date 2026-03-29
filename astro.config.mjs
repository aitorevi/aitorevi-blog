import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), react(), sitemap()],
  site: "https://www.aitorevi.dev/",
  markdown: {
    shikiConfig: {
      // Usar tema light que se integra con el diseño
      theme: 'github-light',
      // Agregar clases para poder agregar el botón de copiar
      wrap: true,
    },
  },
});