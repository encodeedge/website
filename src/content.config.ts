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
        duration: z.string().optional(),
        prerequisites: z.array(z.string()).optional(),
        takeaways: z.array(z.string()).optional(),
        codeSnippet: z.string().optional(),
        videoUrl: z.string().optional(),
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

const instructors = defineCollection({
  loader: glob({ base: "./src/content/instructors", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

const lessons = defineCollection({
  loader: glob({ base: "./src/content/lessons", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lessonType: z.enum(['video', 'article', 'quiz']).default('video'),
    videoUrl: z.string().optional(),
    duration: z.number().optional(),
  }),
});

const courses = defineCollection({
  loader: glob({ base: "./src/content/courses", pattern: "**/*.{md,mdx,json}" }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string().optional(),
    coverImage: z.string().optional(),
    instructor: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    chapters: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      items: z.array(z.discriminatedUnion("discriminant", [
        z.object({ discriminant: z.literal("lesson"), value: z.object({ lessonRef: z.string().optional() }) }),
        z.object({ discriminant: z.literal("quiz"), value: z.object({ quizRef: z.string().optional() }) }),
        z.object({ discriminant: z.literal("assignment"), value: z.object({ assignmentRef: z.string().optional() }) }),
      ])).optional(),
    })).optional(),
  }),
});

const batches = defineCollection({
  loader: glob({ base: "./src/content/batches", pattern: "**/*.{md,mdx,json}" }),
  schema: z.object({
    title: z.string(),
    course: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    capacity: z.number().optional(),
    price: z.number().optional(),
    status: z.enum(['upcoming', 'ongoing', 'completed']).default('upcoming'),
  }),
});

const quizzes = defineCollection({
  loader: glob({ base: "./src/content/quizzes", pattern: "**/*.{md,mdx,json,yaml,yml}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    questions: z.array(z.object({
      question: z.string(),
      type: z.enum(['mcq', 'msq', 'answer']).default('mcq'),
      options: z.array(z.string()).optional(),
      correctAnswer: z.number().optional().nullable(),
      correctAnswers: z.array(z.number()).optional().nullable(),
      numericAnswer: z.number().optional().nullable(),
      explanation: z.string().optional(),
    })).optional(),
  }),
});

const assignments = defineCollection({
  loader: glob({ base: "./src/content/assignments", pattern: "**/*.{md,mdx,json,yaml,yml}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    rubric: z.array(z.object({
      criteria: z.string(),
      maxPoints: z.number(),
    })).optional(),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

const certificates = defineCollection({
  loader: glob({ base: "./src/content/certificates", pattern: "**/*.{md,mdx,json}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    course: z.string().optional(),
    templateImage: z.string().optional(),
  }),
});

export const collections = { blog, faqs, roadmaps, instructors, lessons, courses, batches, quizzes, assignments, certificates };
