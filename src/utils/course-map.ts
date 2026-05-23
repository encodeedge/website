import { getCollection } from 'astro:content';

export async function getCoursesMap() {
  const courses = await getCollection('courses');
  const map: Record<string, any> = {};

  courses.forEach(course => {
    const flatItems: any[] = [];
    course.data.chapters?.forEach(chapter => {
      chapter.items?.forEach(item => {
        let type = '';
        let ref = '';
        if (item.discriminant === 'lesson') {
          type = 'lesson';
          ref = item.value.lessonRef || '';
        } else if (item.discriminant === 'quiz') {
          type = 'quiz';
          ref = item.value.quizRef || '';
        } else if (item.discriminant === 'assignment') {
          type = 'assignment';
          ref = item.value.assignmentRef || '';
        }

        if (ref) {
          const url = `/${type === 'lesson' ? 'lessons' : type === 'quiz' ? 'quizzes' : 'assignments'}/${ref}?course=${course.id}`;
          flatItems.push({
            id: ref,
            type,
            url,
            chapterTitle: chapter.title
          });
        }
      });
    });

    map[course.id] = {
      title: course.data.title,
      flatItems
    };
  });

  return map;
}
