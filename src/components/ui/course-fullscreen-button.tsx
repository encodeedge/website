import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export const CourseFullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Failed to toggle fullscreen:', err);
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
