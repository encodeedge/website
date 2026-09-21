import React, { useState, useEffect } from 'react';
import { PenLine, X, Download, Trash2, Check, Sparkles } from 'lucide-react';

interface LearnerNotesDrawerProps {
  lessonId: string;
  lessonTitle: string;
}

export const LearnerNotesDrawer: React.FC<LearnerNotesDrawerProps> = ({
  lessonId,
  lessonTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`lms_notes_${lessonId}`);
      if (stored) {
        setNotes(stored);
      }
    } catch (e) {
      console.error(e);
    }
  }, [lessonId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    try {
      localStorage.setItem(`lms_notes_${lessonId}`, val);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const content = `# Study Notes: ${lessonTitle}\nDate: ${new Date().toLocaleDateString()}\nLesson ID: ${lessonId}\n\n---\n\n${notes}`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${lessonId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Clear notes for this lesson?')) {
      setNotes('');
      localStorage.removeItem(`lms_notes_${lessonId}`);
    }
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted/60 transition-colors text-foreground shadow-sm"
      >
        <PenLine className="w-3.5 h-3.5 text-primary" />
        <span>My Notes {notes.trim() && '•'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="space-y-1 pr-4 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Study Scratchpad
                  </span>
                  {savedStatus && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3 h-3" /> Autosaved
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold font-display text-foreground truncate">
                  {lessonTitle}
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Editor Area */}
            <div className="flex-1 p-4 flex flex-col space-y-3">
              <textarea
                value={notes}
                onChange={handleChange}
                placeholder="Type your notes, takeaways, formulas, or code snippets here... (autosaves in real time)"
                className="flex-1 w-full p-4 rounded-xl border border-input bg-background text-foreground text-sm font-sans placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
              />

              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                <span>{wordCount} words</span>
                <span>Supports plain text &amp; markdown</span>
              </div>
            </div>

            {/* Footer Toolbar */}
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
              <button
                onClick={handleDownload}
                disabled={!notes.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export (.md)</span>
              </button>

              <button
                onClick={handleClear}
                disabled={!notes.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

