import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export const CourseFullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(active);
      if (active) {
        document.body.classList.add('in-course-fullscreen');
        document.documentElement.classList.add('in-course-fullscreen');
      } else {
        document.body.classList.remove('in-course-fullscreen');
        document.documentElement.classList.remove('in-course-fullscreen');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
          }
        }
        setIsFullscreen(false);
        document.body.classList.remove('in-course-fullscreen');
        document.documentElement.classList.remove('in-course-fullscreen');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('in-course-fullscreen');
      document.documentElement.classList.remove('in-course-fullscreen');
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    try {
      const isCurrentlyFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement) || isFullscreen;

      if (!isCurrentlyFs) {
        setIsFullscreen(true);
        document.body.classList.add('in-course-fullscreen');
        document.documentElement.classList.add('in-course-fullscreen');

        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
      } else {
        setIsFullscreen(false);
        document.body.classList.remove('in-course-fullscreen');
        document.documentElement.classList.remove('in-course-fullscreen');

        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          }
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle issue, CSS fallback active:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all duration-200 shadow-sm cursor-pointer hover:border-primary/40"
      title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Enter Full Screen'}
      aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="w-3.5 h-3.5 text-primary" />
          <span>Exit Full Screen</span>
        </>
      ) : (
        <>
          <Maximize2 className="w-3.5 h-3.5 text-primary" />
          <span>Full Screen</span>
        </>
      )}
    </button>
  );
};
