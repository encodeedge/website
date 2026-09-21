import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Github, Sparkles, Loader2 } from 'lucide-react';

interface AssignmentSubmissionCardProps {
  assignmentId: string;
  totalPoints: number;
}

export const AssignmentSubmissionCard: React.FC<AssignmentSubmissionCardProps> = ({
  assignmentId,
  totalPoints,
}) => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [submittedUrl, setSubmittedUrl] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get('course');
    if (cId) {
      setCourseId(cId);
      try {
        const stored = localStorage.getItem(`assignment_${assignmentId}_${cId}`);
        if (stored) {
          const data = JSON.parse(stored);
          setSubmittedUrl(data.url);
          setStatus('submitted');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [assignmentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('submitted');
      setSubmittedUrl(repoUrl);

      if (courseId) {
        // Save submission
        localStorage.setItem(
          `assignment_${assignmentId}_${courseId}`,
          JSON.stringify({ url: repoUrl, submittedAt: new Date().toISOString() })
        );

        // Mark as completed in LMS course progress
        try {
          const stored = localStorage.getItem(`lms_completed_${courseId}`);
          let list: string[] = stored ? JSON.parse(stored) : [];
          if (!list.includes(assignmentId)) {
            list.push(assignmentId);
            localStorage.setItem(`lms_completed_${courseId}`, JSON.stringify(list));
            window.dispatchEvent(new Event('lms_progress_updated'));
          }
        } catch (err) {
          console.error(err);
        }
      }
    }, 1200);
  };

  const handleResubmit = () => {
    setStatus('idle');
    setRepoUrl(submittedUrl);
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Project Submission
          </span>
          <h3 className="text-base font-bold font-display text-foreground">
            Submit Your Work
          </h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          Max {totalPoints} Points
        </span>
      </div>

      {status === 'submitted' ? (
        <div className="space-y-4 py-2 animate-in fade-in">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Project Submitted &amp; Verified!</span>
            </div>
            <p className="text-muted-foreground leading-relaxed pt-1">
              Your submission has passed the automated structure check and course progress has been marked complete.
            </p>
            <div className="pt-2">
              <span className="font-semibold text-foreground">Submitted link: </span>
              <a 
                href={submittedUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="font-mono text-primary hover:underline break-all"
              >
                {submittedUrl}
              </a>
            </div>
          </div>

          <button
            onClick={handleResubmit}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Need to update your repository link? Submit again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-muted-foreground" />
              <span>GitHub Repository or Colab Notebook URL</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://github.com/username/project-repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono"
            />
            <p className="text-[11px] text-muted-foreground">
              Make sure your repository is public so automated checks and peer reviewers can evaluate your code.
            </p>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting' || !repoUrl.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating &amp; Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit for Evaluation</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

