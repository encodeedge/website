import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Automatically synchronizes course and chapter/module assignments
 * from all course definition files into each individual lesson's frontmatter.
 */
export function syncCourseLessons(rootDir = process.cwd()) {
  const coursesDir = path.join(rootDir, 'src/content/courses');
  const lessonsDir = path.join(rootDir, 'src/content/lessons');

  if (!fs.existsSync(coursesDir) || !fs.existsSync(lessonsDir)) {
    return { updated: 0 };
  }

  const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const lessonToCourseInfo = {};

  for (const courseFile of courseFiles) {
    const courseSlug = courseFile.replace(/\.mdx?$/, '');
    const courseContent = fs.readFileSync(path.join(coursesDir, courseFile), 'utf8');
    const match = courseContent.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    let data;
    try {
      data = yaml.load(match[1]);
    } catch (e) {
      console.warn(`[sync-course-lessons] Warning parsing ${courseFile}:`, e);
      continue;
    }

    if (!data?.chapters || !Array.isArray(data.chapters)) continue;

    for (const chapter of data.chapters) {
      const chapterTitle = chapter?.title || '';
      if (!chapter?.items || !Array.isArray(chapter.items)) continue;

      for (const item of chapter.items) {
        if (item?.discriminant === 'lesson' && item?.value?.lessonRef) {
          const lessonRef = String(item.value.lessonRef).trim();
          lessonToCourseInfo[lessonRef] = {
            course: courseSlug,
            chapter: chapterTitle,
          };
        }
      }
    }
  }

  let updatedCount = 0;
  for (const [lessonRef, info] of Object.entries(lessonToCourseInfo)) {
    const lessonPath = path.join(lessonsDir, `${lessonRef}.md`);
    if (!fs.existsSync(lessonPath)) continue;

    const content = fs.readFileSync(lessonPath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---([\s\S]*)$/);
    if (!match) continue;

    let data;
    try {
      data = yaml.load(match[1]);
    } catch {
      continue;
    }

    if (!data || typeof data !== 'object') data = {};

    // Only update and rewrite if changed
    if (data.course !== info.course || data.chapter !== info.chapter) {
      data.course = info.course;
      data.chapter = info.chapter;
      const newFm = yaml.dump(data, { lineWidth: -1 });
      const body = match[2].startsWith('\n') ? match[2] : `\n${match[2]}`;
      fs.writeFileSync(lessonPath, `---\n${newFm}---${body}`);
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    console.log(`[sync-course-lessons] Automatically updated ${updatedCount} lesson(s) with course/chapter metadata.`);
  }

  return { updated: updatedCount };
}

// Allow direct CLI execution: node src/lib/sync-course-lessons.js
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('sync-course-lessons.js') || 
  process.argv[1].endsWith('sync-course-lessons')
);
if (isDirectRun) {
  const result = syncCourseLessons();
  console.log(`Course-to-lesson synchronization complete. Updated: ${result.updated}`);
}
