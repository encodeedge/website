import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, ShieldCheck, ExternalLink, Sparkles, Printer, Copy, Check } from 'lucide-react';
import { persistentStorage } from '@/lib/storage';
import { CourseCertificateModal } from '@/components/interactive/CourseCertificateModal';

interface CourseCompletionBannerProps {
  courseId: string;
  courseTitle: string;
  totalItems: number;
}

export const CourseCompletionBanner: React.FC<CourseCompletionBannerProps> = ({
  courseId,
  courseTitle,
  totalItems,
}) => {
  const [completedCount, setCompletedCount] = useState(0);
  const [claimedCert, setClaimedCert] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkState = () => {
      // 1. Check completed items
      const storedCompleted = persistentStorage.getSync<string[]>(`lms_completed_${courseId}`, []) ||
        (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`lms_completed_${courseId}`) || '[]') : []);
      setCompletedCount(Array.isArray(storedCompleted) ? storedCompleted.length : 0);

      // 2. Check claimed certificate
      const storedCert = persistentStorage.getSync<any>(`lms_cert_${courseId}`, null) ||
        (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`lms_cert_${courseId}`) || 'null') : null);
      setClaimedCert(storedCert);
    };

    checkState();
    window.addEventListener('lms_progress_updated', checkState);
    window.addEventListener('ee_storage_change', checkState);
    return () => {
      window.removeEventListener('lms_progress_updated', checkState);
      window.removeEventListener('ee_storage_change', checkState);
    };
  }, [courseId]);

  const isCompleted = totalItems > 0 && completedCount >= totalItems;

  if (!isCompleted) {
    return null;
  }

  const verifyUrl = claimedCert?.verifyUrl || 
    (claimedCert?.id ? `/verify/${claimedCert.id}` : null);

  const handleCopyLink = async () => {
    if (!verifyUrl) return;
    try {
      const fullUrl = verifyUrl.startsWith('http') 
        ? verifyUrl 
        : `${window.location.origin}${verifyUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent border-2 border-emerald-500/30 shadow-lg space-y-4 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <Award className="size-6 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                <span>Track Completed • 100% Mastery</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground leading-tight">
                Certificate of Completion
              </h3>
            </div>
          </div>

          {claimedCert ? (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="size-3.5" />
                <span>View &amp; Print Certificate</span>
              </button>

              {verifyUrl && (
                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-card border border-border/80 hover:bg-muted text-foreground font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  <span>Public Verification Link</span>
                  <ExternalLink className="size-3 text-muted-foreground" />
                </a>
              )}

              {verifyUrl && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl bg-card border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-xs cursor-pointer"
                  title="Copy verification link"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer animate-pulse shrink-0"
            >
              <Sparkles className="size-4" />
              <span>Claim Your Certificate 🏆</span>
            </button>
          )}
        </div>

        {claimedCert && (
          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
            <span>
              Certified to: <strong className="text-foreground">{claimedCert.studentName || 'Learner'}</strong>
            </span>
            <span className="font-mono text-[11px]">
              Credential ID: <strong className="text-foreground font-semibold">{claimedCert.id}</strong>
            </span>
            <span>
              Issued: <strong className="text-foreground">{claimedCert.issueDate}</strong>
            </span>
          </div>
        )}
      </div>

      <CourseCertificateModal
        courseId={courseId}
        courseTitle={courseTitle}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isCourseCompleted={true}
        totalItems={totalItems}
        completedItems={completedCount}
      />
    </>
  );
};
