// /src/pages/search.json.ts
// Pre-built search index served as a static JSON endpoint
import { getCollection } from 'astro:content';

export async function GET() {
  const [blogPosts, roadmaps, quizzes, courses] = await Promise.all([
    getCollection('blog'),
    getCollection('roadmaps'),
    getCollection('quizzes'),
    getCollection('courses'),
  ]);

  const index: any[] = [];

  // Blog posts
  for (const post of blogPosts) {
    index.push({
      id: post.id,
      type: 'blog',
      title: post.data.title ?? '',
      description: post.data.description ?? '',
      tags: post.data.tags ?? [],
      topics: post.data.topics ?? [],
      url: `/blog/${post.id}/`,
      image: post.data.image ?? null,
      readTime: post.data.readTime ?? null,
    });
  }

  // Roadmaps
  for (const roadmap of roadmaps) {
    index.push({
      id: roadmap.id,
      type: 'roadmap',
      title: roadmap.data.title ?? '',
      description: roadmap.data.description ?? '',
      tags: [],
      topics: [],
      url: `/roadmaps/${roadmap.id}/`,
      image: (roadmap.data as any).image ?? null,
      readTime: null,
    });
  }

  // Quizzes
  for (const quiz of quizzes) {
    index.push({
      id: quiz.id,
      type: 'quiz',
      title: quiz.data.title ?? '',
      description: quiz.data.description ?? '',
      tags: [],
      topics: [],
      url: `/quizzes/${quiz.id}/`,
      image: null,
      readTime: null,
      questionCount: ((quiz.data as any).questions ?? []).length,
    });
  }

  // Courses
  for (const course of courses) {
    index.push({
      id: course.id,
      type: 'course',
      title: course.data.title ?? '',
      description: course.data.description ?? '',
      tags: [],
      topics: [],
      url: `/courses/${course.id}/`,
      image: (course.data as any).image ?? null,
      readTime: null,
    });
  }

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
