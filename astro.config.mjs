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
import cloudflare from "@astrojs/cloudflare";


import fs from 'node:fs';
import path from 'node:path';

const copyAssetFiles = [
  {
    src: '/home/codespace/.gemini/antigravity/brain/d6ae291e-549e-4067-8064-46bbf2b2a0d6/regression_linear_blueprint_1790418278108.jpg',
    dest: './public/assets/blog/regression-simple-linear-regresison.jpg'
  },
  {
    src: '/home/codespace/.gemini/antigravity/brain/d6ae291e-549e-4067-8064-46bbf2b2a0d6/python_memory_blueprint_1790418301525.jpg',
    dest: './public/assets/blog/python-variables-and-memory-references.jpg'
  },
  {
    src: '/home/codespace/.gemini/antigravity/brain/d6ae291e-549e-4067-8064-46bbf2b2a0d6/python_type_hierarchy_blueprint_1790418344214.jpg',
    dest: './public/assets/blog/python-type-hierarchy.jpg'
  },
  {
    src: '/home/codespace/.gemini/antigravity/brain/d6ae291e-549e-4067-8064-46bbf2b2a0d6/course_deep_learning_1790011532368.jpg',
    dest: './public/assets/courses/applied-deep-learning.jpg'
  },
  {
    src: '/home/codespace/.gemini/antigravity/brain/d6ae291e-549e-4067-8064-46bbf2b2a0d6/course_machine_learning_1790011631147.jpg',
    dest: './public/assets/courses/foundations-of-machine-learning.jpg'
  },
  {
    src: '/home/codespace/.gemini/antigravity/brain/d6ae291e-549e-4067-8064-46bbf2b2a0d6/course_python_mastery_1790011651881.jpg',
    dest: './public/assets/courses/python-mastery-for-ai.jpg'
  }
];

for (const item of copyAssetFiles) {
  try {
    if (fs.existsSync(item.src)) {
      const destDir = path.dirname(item.dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(item.src, item.dest);
    }
  } catch (err) {
    console.error('Error syncing blueprint/course assets:', err);
  }
}

const isCloudflare = process.env.DEPLOY_TARGET === 'cloudflare';

// https://astro.build/config
export default defineConfig({
	site: "https://www.encodeedge.com",
	integrations: [
		mdx({ remarkPlugins: [remarkMath, remarkUnescapeBracesMath], rehypePlugins: [rehypeUnescapeBracesMath, rehypeKatex] }),
		sitemap(),
		react(),
		markdoc(),
		keystatic(),
		partytown({
			config: {
				forward: ["dataLayer.push", "gtag"],
				debug: false,
			},
		}),
	],
  output: isCloudflare ? 'server' : 'static',
  adapter: isCloudflare ? cloudflare() : vercel(),
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ['sharp'],
      },
    },
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