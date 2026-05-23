// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';
import { updateScrollPosition } from 'astro/virtual-modules/transitions-router.js';

export default config({
  storage: {
    kind: 'github',
    repo: 'encodeedge/website',
  },
  ui: {
    brand: { name: 'EncodeEdge' },
    navigation: {
      'Content': ['blogs', 'faqs', 'roadmaps'],
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
          directory: '/public/assets/',
        }),
        authorImage: fields.image({ 
          label: 'Author Image',
          description: 'Enter an online URL or upload a local author avatar.',
          publicPath: '/assets/',
          directory: '/public/assets/',
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
            ], defaultValue: 'link' }),
            affiliate: fields.text({ label: 'Affiliate ID', description: 'Optional affiliate id or tracking code' }),
            image: fields.image({
              label: 'Image',
              description: 'Optional thumbnail or cover image for the reference',
              publicPath: '/assets/',
              directory: '/public/assets/',
            }),
          }),
          {
            label: 'References',
            description: 'Add related books, links or courses for this post',
            itemLabel: props => props.fields.title.value ,
          }
        ),
        content: fields.mdx({ label: 'Content', extension: 'md', 
        options: {
        image: {
          directory: '/public/assets/', // For images embedded within MDX content
          publicPath: '/assets/', // Use an alias for easier referencing
        },
      },
        }),
      },
    }),
    faqs: collection({
      label: 'FAQs',
      slugField: 'question',
      path: 'src/content/faqs/*',
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
        content: fields.mdx({ label: 'Content', extension: 'md', description: 'Optional content for the roadmap page' }),
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
          directory: '/public/assets/courses/',
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
          directory: '/public/assets/instructors/',
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
            { label: 'Video', value: 'video' },
            { label: 'Article', value: 'article' },
          ],
          defaultValue: 'video'
        }),
        videoUrl: fields.text({ label: 'Video URL', description: 'YouTube or Vimeo embed URL' }),
        duration: fields.number({ label: 'Duration (in minutes)' }),
        content: fields.mdx({ label: 'Content', extension: 'md' }),
      }
    }),
    quizzes: collection({
      label: 'Quizzes',
      slugField: 'title',
      path: 'src/content/quizzes/*',
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
          directory: '/public/assets/certificates/',
        }),
      }
    }),
  },
});