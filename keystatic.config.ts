// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';
import { updateScrollPosition } from 'astro/virtual-modules/transitions-router.js';

export default config({
  storage: {
    kind: 'github',
    repo: 'encodeedge/website',
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
  },
});