import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';

import { findMatchingLesson } from './lesson-matcher.js';

/**
 * Helper to recursively find all markdown files in a directory
 */
function getAllLessonFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllLessonFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const id = relPath.replace(/\.mdx?$/, '');
      const filename = entry.name.replace(/\.mdx?$/, '');
      results.push({ fullPath, relPath, id, filename });
    }
  }
  return results;
}

/**
 * Automatically synchronizes course and chapter/module assignments
 * from all course definition files into each individual lesson's frontmatter,
 * and auto-heals any renamed lesson references in course curriculum files.
 */
export function syncCourseLessons(rootDir = process.cwd()) {
  const coursesDir = path.join(rootDir, 'src/content/courses');
  const lessonsDir = path.join(rootDir, 'src/content/lessons');

  if (!fs.existsSync(coursesDir) || !fs.existsSync(lessonsDir)) {
    return { updated: 0 };
  }

  // Pre-load all existing lessons (flat and in subdirectories)
  const allLessonFiles = getAllLessonFiles(lessonsDir);
  const allLessonEntries = allLessonFiles.map(f => {
    try {
      const c = fs.readFileSync(f.fullPath, 'utf8');
      const m = c.match(/^---\n([\s\S]*?)\n---/);
      const d = m ? yaml.load(m[1]) : {};
      return { id: f.id, filename: f.filename, fullPath: f.fullPath, data: d || {} };
    } catch {
      return { id: f.id, filename: f.filename, fullPath: f.fullPath, data: {} };
    }
  });

  const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const lessonToCourseInfo = {};

  for (const courseFile of courseFiles) {
    const courseFilePath = path.join(coursesDir, courseFile);
    const courseSlug = courseFile.replace(/\.mdx?$/, '');
    const courseContent = fs.readFileSync(courseFilePath, 'utf8');
    const match = courseContent.match(/^---\n([\s\S]*?)\n---([\s\S]*)$/);
    if (!match) continue;

    let data;
    try {
      data = yaml.load(match[1]);
    } catch (e) {
      console.warn(`[sync-course-lessons] Warning parsing ${courseFile}:`, e);
      continue;
    }

    if (!data?.chapters || !Array.isArray(data.chapters)) continue;

    let courseChanged = false;
    for (const chapter of data.chapters) {
      const chapterTitle = chapter?.title || '';
      if (!chapter?.items || !Array.isArray(chapter.items)) continue;

      for (const item of chapter.items) {
        if (item?.discriminant === 'lesson' && item?.value?.lessonRef) {
          let lessonRef = String(item.value.lessonRef).trim();
          let targetLesson = allLessonEntries.find(l => l.id === lessonRef || l.filename === lessonRef);

          // Auto-heal if the lesson was renamed
          if (!targetLesson) {
            const matched = findMatchingLesson(lessonRef, allLessonEntries);
            if (matched && matched.id !== lessonRef) {
              console.log(`[sync-course-lessons] Auto-healing broken reference in ${courseFile}: '${lessonRef}' -> '${matched.id}'`);
              item.value.lessonRef = matched.id;
              lessonRef = matched.id;
              targetLesson = matched;
              courseChanged = true;
            }
          }

          if (targetLesson) {
            lessonToCourseInfo[targetLesson.fullPath] = {
              course: courseSlug,
              chapter: chapterTitle,
            };
          }
        }
      }
    }

    if (courseChanged) {
      const newFm = yaml.dump(data, { lineWidth: -1 });
      const body = match[2].startsWith('\n') ? match[2] : `\n${match[2]}`;
      fs.writeFileSync(courseFilePath, `---\n${newFm}---${body}`);
      console.log(`[sync-course-lessons] Successfully healed and updated curriculum references in ${courseFile}.`);
    }
  }

  let updatedCount = 0;
  for (const [lessonFullPath, info] of Object.entries(lessonToCourseInfo)) {
    if (!fs.existsSync(lessonFullPath)) continue;

    const content = fs.readFileSync(lessonFullPath, 'utf8');
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
      fs.writeFileSync(lessonFullPath, `---\n${newFm}---${body}`);
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
