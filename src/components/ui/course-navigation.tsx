import React, { useEffect, useState } from 'react';
import { Button } from './button';

type FlatItem = {
  id: string;
  type: string;
  url: string;
  chapterTitle: string;
};

type CourseMap = {
  [courseId: string]: {
    title: string;
    flatItems: FlatItem[];
  };
};

export const CourseNavigation = ({ coursesMap, currentItemId, itemType, mode = 'both' }: { coursesMap: CourseMap, currentItemId: string, itemType: string, mode?: 'top' | 'bottom' | 'both' }) => {
  const [navData, setNavData] = useState<{
    courseId: string;
    courseName: string;
    prev: FlatItem | null;
    next: FlatItem | null;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('course');
    if (!courseId || !coursesMap[courseId]) return;

    const course = coursesMap[courseId];
    const items = course.flatItems;
    const currentIndex = items.findIndex(item => item.id === currentItemId && item.type === itemType);

    if (currentIndex !== -1) {
      setNavData({
        courseId,
        courseName: course.title,
        prev: currentIndex > 0 ? items[currentIndex - 1] : null,
        next: currentIndex < items.length - 1 ? items[currentIndex + 1] : null,
      });
    }
  }, [currentItemId, itemType, coursesMap]);

  if (!navData) return null;

  return (
    <div className="w-full">
      {(mode === 'top' || mode === 'both') && (
        <div className="mb-8 flex justify-between items-center gap-4 flex-wrap">
          <a href={`/courses/${navData.courseId}`} className="text-sm text-primary hover:underline flex items-center gap-2">
            &larr; Back to {navData.courseName}
          </a>
          <div className="flex gap-2 ml-auto">
            {navData.prev && (
              <a href={navData.prev.url}>
                <Button variant="outline" size="sm">Previous</Button>
              </a>
            )}
            {navData.next && (
              <a href={navData.next.url}>
                <Button size="sm">Next</Button>
              </a>
            )}
          </div>
        </div>
      )}

      {(mode === 'bottom' || mode === 'both') && (
        <div className="flex justify-between items-center pt-8 border-t border-border flex-wrap gap-4 mt-12">
          {navData.prev ? (
            <a href={navData.prev.url} className="block">
              <Button variant="outline" className="flex flex-col items-start h-auto py-2 px-4 gap-1">
                <span className="text-xs text-muted-foreground font-normal uppercase tracking-wider">Previous</span>
                <span className="font-medium text-left line-clamp-1">{navData.prev.chapterTitle}: {navData.prev.type}</span>
              </Button>
            </a>
          ) : <div />}

          {navData.next ? (
            <a href={navData.next.url} className="block ml-auto">
              <Button className="flex flex-col items-end h-auto py-2 px-4 gap-1">
                <span className="text-xs text-primary-foreground/80 font-normal uppercase tracking-wider">Next</span>
                <span className="font-medium text-right line-clamp-1">{navData.next.chapterTitle}: {navData.next.type}</span>
              </Button>
            </a>
          ) : <div />}
        </div>
      )}
    </div>
  );
};
