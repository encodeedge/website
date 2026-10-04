import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export const CourseFullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        sessionStorage.getItem('lms_fullscreen') === 'true' ||
        new URLSearchParams(window.location.search).get('fullscreen') === '1'
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('lms_fullscreen', isFullscreen ? 'true' : 'false');
    } catch {}
    if (isFullscreen) {
      document.body.classList.add('in-course-fullscreen');
      document.documentElement.classList.add('in-course-fullscreen');
    } else {
      document.body.classList.remove('in-course-fullscreen');
      document.documentElement.classList.remove('in-course-fullscreen');
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!active && !isFullscreen) {
        setIsFullscreen(false);
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
        try {
          sessionStorage.setItem('lms_fullscreen', 'false');
        } catch {}
        document.body.classList.remove('in-course-fullscreen');
        document.documentElement.classList.remove('in-course-fullscreen');
        if (window.location.search.includes('fullscreen=')) {
          const url = new URL(window.location.href);
          url.searchParams.delete('fullscreen');
          window.history.replaceState({}, '', url.toString());
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    try {
      const isCurrentlyFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement) || isFullscreen;

      if (!isCurrentlyFs) {
        setIsFullscreen(true);
        try {
          sessionStorage.setItem('lms_fullscreen', 'true');
        } catch {}
        document.body.classList.add('in-course-fullscreen');
        document.documentElement.classList.add('in-course-fullscreen');

        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
      } else {
        setIsFullscreen(false);
        try {
          sessionStorage.setItem('lms_fullscreen', 'false');
        } catch {}
        document.body.classList.remove('in-course-fullscreen');
        document.documentElement.classList.remove('in-course-fullscreen');

        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          }
        }

        if (window.location.search.includes('fullscreen=')) {
          const url = new URL(window.location.href);
          url.searchParams.delete('fullscreen');
          window.history.replaceState({}, '', url.toString());
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
