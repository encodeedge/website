// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

export const mdxComponents = {
  Callout: wrapper({
    label: 'Callout Box',
    description: 'Highlighted callout note, tip, warning, or alert',
    schema: {
      kind: fields.select({
        label: 'Type',
        options: [
          { label: 'Info (Blue)', value: 'info' },
          { label: 'Tip (Green)', value: 'tip' },
          { label: 'Warning (Amber)', value: 'warning' },
          { label: 'Danger (Red)', value: 'danger' },
          { label: 'Success (Lime)', value: 'success' },
        ],
        defaultValue: 'info',
      }),
      title: fields.text({ label: 'Title (Optional)' }),
    },
  }),
  VideoEmbed: block({
    label: 'Video Embed',
    description: 'Embed a YouTube or Vimeo video',
    schema: {
      url: fields.text({ label: 'Video URL', validation: { isRequired: true } }),
      caption: fields.text({ label: 'Caption (Optional)' }),
    },
  }),
  AudioPlayer: block({
    label: 'Podcast / Audio Player',
    description: 'Embed an audio/podcast player widget',
    schema: {
      title: fields.text({ label: 'Audio / Episode Title', validation: { isRequired: true } }),
      audioUrl: fields.text({ label: 'Audio File URL (.mp3 / stream)' }),
      duration: fields.text({ label: 'Duration (e.g. 15 min)' }),
      host: fields.text({ label: 'Host / Creator Name' }),
      description: fields.text({ label: 'Short Description', multiline: true }),
    },
  }),
  QuizBlock: block({
    label: 'Interactive Quiz / Question',
    description: 'Test reader knowledge with an interactive question',
    schema: {
      question: fields.text({ label: 'Question', validation: { isRequired: true } }),
      option1: fields.text({ label: 'Option A', validation: { isRequired: true } }),
      option2: fields.text({ label: 'Option B', validation: { isRequired: true } }),
      option3: fields.text({ label: 'Option C' }),
      option4: fields.text({ label: 'Option D' }),
      correctAnswer: fields.select({
        label: 'Correct Option',
        options: [
          { label: 'Option A', value: '0' },
          { label: 'Option B', value: '1' },
          { label: 'Option C', value: '2' },
          { label: 'Option D', value: '3' },
        ],
        defaultValue: '0',
      }),
      explanation: fields.text({ label: 'Explanation (Shown after answering)', multiline: true }),
    },
  }),
  NewsletterCTA: block({
    label: 'Newsletter CTA',
    description: 'In-article newsletter subscription box',
    schema: {
      title: fields.text({ label: 'Heading' }),
      description: fields.text({ label: 'Description', multiline: true }),
      buttonText: fields.text({ label: 'Button Label' }),
    },
  }),
  StatCard: block({
    label: 'Stat / Takeaway Card',
    description: 'Highlight a key metric or takeaway',
    schema: {
      statValue: fields.text({ label: 'Stat Value / Metric (e.g. 98.5% or 4.2x)', validation: { isRequired: true } }),
      label: fields.text({ label: 'Label', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', multiline: true }),
      accent: fields.select({
        label: 'Accent Color',
        options: [
          { label: 'Lime Yellow', value: 'lime' },
          { label: 'Rose Pink', value: 'rose' },
          { label: 'Sky Blue', value: 'blue' },
          { label: 'Lavender Purple', value: 'lavender' },
          { label: 'Peach Orange', value: 'peach' },
        ],
        defaultValue: 'lime',
      }),
    },
  }),
  CodeSnippet: block({
    label: 'Code Snippet Block',
    description: 'Syntax-highlighted code block with title and copy button',
    schema: {
      language: fields.text({ label: 'Language (e.g. python, typescript, bash)' }),
      filename: fields.text({ label: 'Filename / Title' }),
      code: fields.text({ label: 'Code Content', multiline: true, validation: { isRequired: true } }),
    },
  }),
  ReferenceCard: block({
    label: 'Resource / Reference Card',
    description: 'Recommend a book, course, paper, or link',
    schema: {
      title: fields.text({ label: 'Resource Title', validation: { isRequired: true } }),
      url: fields.text({ label: 'URL', validation: { isRequired: true } }),
      type: fields.select({
        label: 'Type',
        options: [
          { label: 'Link', value: 'link' },
          { label: 'Book', value: 'book' },
          { label: 'Course', value: 'course' },
          { label: 'Research Paper', value: 'paper' },
          { label: 'Documentation', value: 'documentation' },
        ],
        defaultValue: 'link',
      }),
      author: fields.text({ label: 'Author / Publisher' }),
      description: fields.text({ label: 'Description', multiline: true }),
    },
  }),
  InteractiveLab: block({
    label: 'Interactive Lab Simulator',
    description: 'Embed a hands-on visual simulator widget',
    schema: {
      type: fields.select({
        label: 'Simulator Type',
        options: [
          { label: 'Neural Network & Activation Playground', value: 'neural-playground' },
          { label: 'Loss Surface & Gradient Descent Optimizer Lab', value: 'gradient-descent' },
          { label: 'CPython Stack & Heap Memory Explorer', value: 'memory-explorer' },
        ],
        defaultValue: 'neural-playground',
      }),
    },
  }),
  CodeSandbox: block({
    label: 'Interactive Code Sandbox',
    description: 'Embed an in-browser code runner with terminal output',
    schema: {
      snippetId: fields.text({ label: 'Initial Snippet ID (Optional)' }),
      category: fields.select({
        label: 'Category Scope',
        options: [
          { label: 'Auto (Scoped to Course / Lesson)', value: 'auto' },
          { label: 'Python Systems', value: 'Python Systems' },
          { label: 'Deep Learning', value: 'Deep Learning' },
          { label: 'Machine Learning', value: 'Machine Learning' },
          { label: 'LLMs & RAG', value: 'LLMs & RAG' },
        ],
        defaultValue: 'auto',
      }),
      title: fields.text({ label: 'Title Override (Optional)' }),
    },
  }),
};

export default config({
  storage: (process.env.NODE_ENV === 'development' || process.env.KEYSTATIC_LOCAL)
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'encodeedge/website',
      },
  ui: {
    brand: { name: 'EncodeEdge' },
    navigation: {
      'Content': ['blogs', 'faqs', 'roadmaps'],
      'Components': ['components'],
      'LMS Core': ['courses', 'batches', 'instructors'],
      'LMS Material': ['lessons', 'quizzes', 'assignments'],
      'LMS Administration': ['certificates']
    }
  },

  collections: {
    blogs: collection({
      label: 'Blogs',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' , validation: { isRequired: true }} ),
        pubDate: fields.date({ label: 'Publication Date', validation: { isRequired: true } }),
        updatedDate: fields.date({ label: 'Updated Date', validation: { isRequired: true } }),
        readTime: fields.number({ label: 'Estimated Read Time (minutes)' }),
        featured: fields.checkbox({ label: 'Featured Post', description: 'Mark this post as featured to highlight it on the homepage.' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            description: 'Add relevant keywords for search (e.g., Python, Neural Networks).',
            itemLabel: props => props.value,
          }
        ),
        topics: fields.multiselect({
            label: 'Topic',
            description: 'Select the primary topic category for this blog.',
            options: [
                { label: 'Machine Learning', value: 'machine-learning' },
                { label: 'Deep Learning', value: 'deep-learning' },
                { label: 'Data Science', value: 'data-science' },
                { label: 'Natural Language Processing', value: 'nlp' },
                { label: 'Computer Vision', value: 'computer-vision' },
                { label: 'Web Development', value: 'web-dev' },
                { label: 'Python', value: 'python' },
            ]
        }),
        image: fields.image({ 
          label: 'Blog Post Image',
          description: 'Enter an online URL or upload a local image.',
          publicPath: '/assets/',
          directory: 'public/assets/',
        }),
        authorImage: fields.image({ 
          label: 'Author Image',
          description: 'Enter an online URL or upload a local author avatar.',
          publicPath: '/assets/',
          directory: 'public/assets/',
        }),
        authorName: fields.text({ label: 'Author Name', validation: { isRequired: true } }),
        faqs: fields.array(
          fields.object({
            question: fields.text({ label: 'Question', validation: { isRequired: true } }),
            answer: fields.text({ label: 'Answer', validation: { isRequired: true } }),
            category: fields.text({ label: 'Category', description: 'Optional grouping/category' }),
          }),
          {
            label: 'FAQs',
            description: 'Add question and answer pairs to embed in this post',
            itemLabel: props => props.fields.question.value || 'Q&A',
          }
        ),
        references: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            url: fields.text({ label: 'URL', validation: { isRequired: true } }),
            description: fields.text({ label: 'Description' }),
            type: fields.select({ label: 'Type', options: [
              { label: 'Book', value: 'book' },
              { label: 'Link', value: 'link' },
              { label: 'Course', value: 'course' },
              { label: 'Documentation', value: 'docs' },
              { label: 'Documentation (Long)', value: 'documentation' },
              { label: 'Research Paper', value: 'paper' },
              { label: 'Article', value: 'article' },
            ], defaultValue: 'link' }),
            affiliate: fields.text({ label: 'Affiliate ID', description: 'Optional affiliate id or tracking code' }),
            image: fields.image({
              label: 'Image',
              description: 'Optional thumbnail or cover image for the reference',
              publicPath: '/assets/',
              directory: 'public/assets/',
            }),
          }),
          {
            label: 'References',
            description: 'Add related books, links or courses for this post',
            itemLabel: props => props.fields.title.value ,
          }
        ),
        content: fields.mdx({
          label: 'Content',
          extension: 'mdx',
          components: mdxComponents,
          options: {
            image: {
              directory: 'public/assets/',
              publicPath: '/assets/',
            },
          },
        }),
      },
    }),
    faqs: collection({
      label: 'FAQs',
      slugField: 'question',
      path: 'src/content/faqs/*',
      format: { data: 'yaml' },
      schema: {
        question: fields.text({ label: 'Question', validation: { isRequired: true } }),
        answer: fields.text({ label: 'Answer', validation: { isRequired: true } }),
        category: fields.text({ label: 'Category', description: 'Optional grouping/category for the question' }),
      },
    }),
    roadmaps: collection({
      label: 'Roadmaps',
      slugField: 'title',
      path: 'src/content/roadmaps/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', validation: { isRequired: true } }),
        image: fields.image({
          label: 'Cover Image',
          description: 'Roadmap preview graphic or illustration',
          publicPath: '/assets/roadmaps/',
          directory: 'public/assets/roadmaps',
        }),
        featured: fields.checkbox({ label: 'Featured', description: 'Highlight this roadmap' }),
        nodes: fields.array(
          fields.object({
            title: fields.text({ label: 'Section Title' }),
            id: fields.text({ label: 'Section ID' }),
            description: fields.text({ label: 'Section Description' }),
            topics: fields.array(
              fields.object({
                name: fields.text({ label: 'Topic Name' }),
                description: fields.text({ label: 'Topic Description' }),
                difficulty: fields.select({
                  label: 'Difficulty',
                  options: [
                    { label: 'Beginner', value: 'beginner' },
                    { label: 'Intermediate', value: 'intermediate' },
                    { label: 'Advanced', value: 'advanced' },
                  ],
                  defaultValue: 'beginner',
                }),
                optional: fields.checkbox({ label: 'Optional', description: 'Is this topic optional?' }),
                duration: fields.text({ label: 'Duration', description: 'Estimated time to complete (e.g., "2 hours")' }),
                prerequisites: fields.array(
                  fields.text({ label: 'Prerequisite' }),
                  { label: 'Prerequisites', itemLabel: props => props.value }
                ),
                takeaways: fields.array(
                  fields.text({ label: 'Key Takeaway' }),
                  { label: 'Key Takeaways', itemLabel: props => props.value }
                ),
                codeSnippet: fields.text({ label: 'Code Example', multiline: true, description: 'Optional code snippet' }),
                videoUrl: fields.text({ label: 'Video Tutorial URL' }),
                links: fields.array(
                  fields.object({
                    title: fields.text({ label: 'Title' }),
                    url: fields.text({ label: 'URL' }),
                  }),
                  { label: 'Links', itemLabel: props => props.fields.title.value }
                ),
                references: fields.array(
                  fields.object({
                    title: fields.text({ label: 'Title' }),
                    url: fields.text({ label: 'URL' }),
                  }),
                  { label: 'References', itemLabel: props => props.fields.title.value }
                ),
              }),
              { label: 'Topics', itemLabel: props => props.fields.name.value }
            ),
          }),
          { label: 'Nodes', itemLabel: props => props.fields.title.value }
        ),
        content: fields.mdx({ label: 'Content', extension: 'md', components: mdxComponents, description: 'Optional content for the roadmap page' }),
      },
    }),
    
    // --- LMS Core ---
    courses: collection({
      label: 'Courses',
      slugField: 'title',
      path: 'src/content/courses/*',
      format: { contentField: 'about' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        shortDescription: fields.text({ label: 'Short Description', multiline: true }),
        coverImage: fields.image({
          label: 'Cover Image',
          publicPath: '/assets/courses/',
          directory: 'public/assets/courses',
        }),
        instructor: fields.relationship({
          label: 'Instructor',
          collection: 'instructors',
        }),
        level: fields.select({
          label: 'Level',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
          defaultValue: 'beginner'
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'draft'
        }),
        chapters: fields.array(
          fields.object({
            title: fields.text({ label: 'Chapter Title' }),
            description: fields.text({ label: 'Chapter Description' }),
            items: fields.blocks(
              {
                lesson: {
                  label: 'Lesson',
                  schema: fields.object({
                    lessonRef: fields.relationship({ label: 'Select Lesson', collection: 'lessons' })
                  })
                },
                quiz: {
                  label: 'Quiz',
                  schema: fields.object({
                    quizRef: fields.relationship({ label: 'Select Quiz', collection: 'quizzes' })
                  })
                },
                assignment: {
                  label: 'Assignment',
                  schema: fields.object({
                    assignmentRef: fields.relationship({ label: 'Select Assignment', collection: 'assignments' })
                  })
                }
              },
              { label: 'Curriculum Items' }
            ),
          }),
          { label: 'Chapters', itemLabel: props => props.fields.title.value }
        ),
        about: fields.mdx({ label: 'About this Course', extension: 'md' }),
      }
    }),
    batches: collection({
      label: 'Batches',
      slugField: 'title',
      path: 'src/content/batches/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Batch Title' } }),
        course: fields.relationship({ label: 'Course', collection: 'courses' }),
        startDate: fields.date({ label: 'Start Date' }),
        endDate: fields.date({ label: 'End Date' }),
        capacity: fields.number({ label: 'Capacity' }),
        price: fields.number({ label: 'Price (Optional)' }),
        status: fields.select({
           label: 'Status',
           options: [
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Completed', value: 'completed' }
           ],
           defaultValue: 'upcoming'
        }),
        content: fields.mdx({ label: 'Batch Information (Optional)', extension: 'md' }),
      }
    }),
    instructors: collection({
      label: 'Instructors',
      slugField: 'name',
      path: 'src/content/instructors/*',
      format: { contentField: 'bio' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        avatar: fields.image({
          label: 'Avatar',
          publicPath: '/assets/instructors/',
          directory: 'public/assets/instructors',
        }),
        socialLinks: fields.array(
          fields.object({
            platform: fields.text({ label: 'Platform' }),
            url: fields.text({ label: 'URL' }),
          }),
          { label: 'Social Links', itemLabel: props => props.fields.platform.value }
        ),
        bio: fields.mdx({ label: 'Bio', extension: 'md' }),
      }
    }),

    // --- LMS Material ---
    lessons: collection({
      label: 'Lessons',
      slugField: 'title',
      path: 'src/content/lessons/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        lessonType: fields.select({
          label: 'Lesson Type',
          options: [
            { label: 'Video Lesson', value: 'video' },
            { label: 'Article / Written Lesson', value: 'article' },
            { label: 'Interactive Lab Simulator', value: 'lab' },
          ],
          defaultValue: 'video'
        }),
        interactiveLab: fields.select({
          label: 'Interactive Lab Embed',
          description: 'Optionally embed a specialized interactive simulation widget into this lesson',
          options: [
            { label: 'None', value: 'none' },
            { label: 'CPython Stack & Heap Memory Explorer', value: 'memory-explorer' },
            { label: 'Neural Network & Activation Playground', value: 'neural-playground' },
            { label: 'Loss Surface & Gradient Descent Optimizer Lab', value: 'gradient-descent' },
            { label: 'Interactive Code Sandbox', value: 'code-sandbox' },
          ],
          defaultValue: 'none',
        }),
        videoUrl: fields.text({ label: 'Video URL', description: 'YouTube or Vimeo embed URL' }),
        duration: fields.number({ label: 'Duration (in minutes)' }),
        content: fields.mdx({ label: 'Content', extension: 'md', components: mdxComponents }),
      }
    }),
    quizzes: collection({
      label: 'Quizzes',
      slugField: 'title',
      path: 'src/content/quizzes/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        questions: fields.array(
          fields.object({
            question: fields.text({ label: 'Question', multiline: true, validation: { isRequired: true } }),
            type: fields.select({
              label: 'Question Type',
              options: [
                { label: 'Multiple Choice (MCQ)', value: 'mcq' },
                { label: 'Multiple Select (MSQ)', value: 'msq' },
                { label: 'Numeric Answer (Decimals)', value: 'answer' },
              ],
              defaultValue: 'mcq',
            }),
            options: fields.array(
              fields.text({ label: 'Option' }),
              { label: 'Options (Leave empty for Numeric Answer)', itemLabel: props => props.value }
            ),
            correctAnswer: fields.number({ label: 'Correct Answer Index (0-based) for MCQ' }),
            correctAnswers: fields.array(
              fields.number({ label: 'Correct Answer Index' }),
              { label: 'Correct Answer Indices (0-based) for MSQ' }
            ),
            numericAnswer: fields.number({ label: 'Correct Numeric Answer' }),
            explanation: fields.text({ label: 'Explanation', multiline: true }),
          }),
          { label: 'Questions', itemLabel: props => props.fields.question.value }
        ),
      }
    }),
    assignments: collection({
      label: 'Assignments',
      slugField: 'title',
      path: 'src/content/assignments/*',
      format: { contentField: 'instructions' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        rubric: fields.array(
          fields.object({
            criteria: fields.text({ label: 'Criteria', validation: { isRequired: true } }),
            maxPoints: fields.number({ label: 'Max Points', validation: { isRequired: true } }),
          }),
          { label: 'Grading Rubric', itemLabel: props => `${props.fields.criteria.value} (${props.fields.maxPoints.value} pts)` }
        ),
        resources: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            url: fields.text({ label: 'URL / Path', validation: { isRequired: true } }),
          }),
          { label: 'Downloadable Resources', itemLabel: props => props.fields.title.value }
        ),
        instructions: fields.mdx({ label: 'Detailed Instructions', extension: 'md' }),
      }
    }),

    // --- Reusable Components ---
    components: collection({
      label: 'Reusable Components',
      slugField: 'name',
      path: 'src/content/components/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.slug({ name: { label: 'Component Name' } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Callout / Alert', value: 'callout' },
            { label: 'Newsletter / CTA', value: 'cta' },
            { label: 'Banner / Announcement', value: 'banner' },
            { label: 'Audio / Podcast Feature', value: 'podcast' },
            { label: 'Resource / Reference', value: 'resource' },
          ],
          defaultValue: 'callout',
        }),
        description: fields.text({ label: 'Description / Purpose', multiline: true }),
        buttonText: fields.text({ label: 'Button / Action Text (Optional)' }),
        buttonUrl: fields.text({ label: 'Button / Action URL (Optional)' }),
        accentColor: fields.select({
          label: 'Accent Color',
          options: [
            { label: 'Lime Yellow (Theme Accent)', value: '#E5E795' },
            { label: 'Rose Pink', value: '#FDA4AF' },
            { label: 'Sky Blue', value: '#A2D2FF' },
            { label: 'Lavender Purple', value: '#EEA9ED' },
            { label: 'Peach Orange', value: '#FFB86A' },
            { label: 'Mint Green', value: '#A7F3D0' },
          ],
          defaultValue: '#E5E795',
        }),
        content: fields.mdx({ label: 'Content', extension: 'md', components: mdxComponents }),
      },
    }),

    // --- LMS Administration ---
    certificates: collection({
      label: 'Certificates',
      slugField: 'title',
      path: 'src/content/certificates/*',
      schema: {
        title: fields.slug({ name: { label: 'Template Name' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        course: fields.relationship({ label: 'Associated Course', collection: 'courses' }),
        templateImage: fields.image({
          label: 'Background Template Image',
          publicPath: '/assets/certificates/',
          directory: 'public/assets/certificates',
        }),
      }
    }),
  },
});