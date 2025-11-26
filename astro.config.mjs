// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import keystatic from '@keystatic/astro'
import markdoc from "@astrojs/markdoc";


// https://astro.build/config
export default defineConfig({
  site: "https://encodeedge.github.io",
  base: "/website",
  integrations: [mdx(), sitemap(), react(), markdoc(), keystatic()],
  output: "static",

  vite: {
    plugins: [tailwindcss()],
  },
});