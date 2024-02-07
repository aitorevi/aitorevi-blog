import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel/dist/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), react()],

  output: "server",
  adapter: vercel()
});