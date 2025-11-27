// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';
import { updateScrollPosition } from 'astro/virtual-modules/transitions-router.js';

export default config({
  storage: {
    kind: 'local',
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
        content: fields.mdx({ label: 'Content', extension: 'md' }),
      },
    }),
  },
});