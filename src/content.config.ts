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
    'python',
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
    faqs: z.array(z.object({ question: z.string(), answer: z.string(), category: z.string().optional() })).optional(),
    references: z.array(z.object({ title: z.string(), url: z.string(), description: z.string().optional(), type: z.string().optional(), affiliate: z.string().optional(), image: z.string().optional() })).optional(),
    topics: z.array(TOPIC_SLUGS), 
    tags: z.array(z.string()).optional(), 
    featured: z.boolean().optional(),
  }),
});

const faqs = defineCollection({
  loader: glob({ base: "./src/content/faqs", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional(),
  }),
});

const roadmaps = defineCollection({
  loader: glob({ base: "./src/content/roadmaps", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    featured: z.boolean().optional(),
    nodes: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      url: z.string().optional(),
      dependsOn: z.array(z.string()).optional(),
      topics: z.array(z.object({
        name: z.string(),
        description: z.string(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
        optional: z.boolean().optional(),
        links: z.array(z.object({
          title: z.string(),
          url: z.string(),
        })).optional(),
        references: z.array(z.object({
          title: z.string(),
          url: z.string(),
        })).optional(),
      })).optional(),
    })).optional(),
  }),
});

export const collections = { blog, faqs, roadmaps };
