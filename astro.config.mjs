// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import keystatic from '@keystatic/astro'
import markdoc from "@astrojs/markdoc";
import vercel from "@astrojs/vercel";
import remarkMath from 'remark-math'
import remarkUnescapeBracesMath from './src/remark/remark-unescape-braces-math.js'
import rehypeKatex from 'rehype-katex'
import rehypeUnescapeBracesMath from './src/rehype/rehype-unescape-braces-math.js'
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
	site: "https://www.encodeedge.com",
	integrations: [
		mdx({ remarkPlugins: [remarkMath, remarkUnescapeBracesMath], rehypePlugins: [rehypeUnescapeBracesMath, rehypeKatex] }),
		sitemap(),
		react(),
		markdoc(),
		keystatic(),
		partytown({ config: { forward: ['dataLayer.push'] } }),
	],
  output: "static",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  	markdown: {
		remarkPlugins: [remarkMath, remarkUnescapeBracesMath],
		rehypePlugins: [
			rehypeUnescapeBracesMath,
			[rehypeKatex, {
				// Katex plugin options
			}]
		]
	}
});