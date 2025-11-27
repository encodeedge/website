import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Define the slug values for consistency with Keystatic's multiselect options
const TOPIC_SLUGS = z.enum([
    'machine-learning',
    'deep-learning',
    'data-science',
    'nlp',
    'computer-vision',
    'web-dev',
]);

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    readTime: z.number().optional(),
    image: z.string().optional(),
    authorImage: z.string().optional(),
    authorName: z.string().optional(),
    topics: z.array(TOPIC_SLUGS), 
    tags: z.array(z.string()).optional(), 
    featured: z.boolean().optional(),
  }),
});

export const collections = { blog };
