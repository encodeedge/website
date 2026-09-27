import React, { useState, useEffect } from 'react';
import { 
  Award, 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { persistentStorage } from '@/lib/storage';
import { 
  signCertificatePayload, 
  buildVerifiedCertificateUrl 
} from '@/lib/certificate-security';

interface CourseCertificateModalProps {
  courseTitle: string;
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  isCourseCompleted?: boolean;
  totalItems?: number;
  completedItems?: number;
}

export const CourseCertificateModal: React.FC<CourseCertificateModalProps> = ({
  courseTitle,
  courseId,
  isOpen,
  onClose,
  isCourseCompleted,
  totalItems,
  completedItems,
}) => {
  const [studentName, setStudentName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [signature, setSignature] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueDate, setIssueDate] = useState(() => 
    new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  );
  const [certHash, setCertHash] = useState(() => 
    `EE-${courseId.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`
  );

  // Check actual completion from local storage if not explicitly provided
  const storedCompleted = persistentStorage.getSync<string[]>(`lms_completed_${courseId}`, []) ||
    (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`lms_completed_${courseId}`) || '[]') : []);

  const effectiveCompletedCount = completedItems !== undefined ? completedItems : storedCompleted.length;
  const isEligible = isCourseCompleted !== undefined 
    ? isCourseCompleted 
    : (totalItems ? effectiveCompletedCount >= totalItems : effectiveCompletedCount > 0);

  // Sync stored student name and existing certificate record on open
  useEffect(() => {
    if (!isOpen) return;

    try {
      // 1. Check existing cert record
      const existingCert = persistentStorage.getSync<any>(`lms_cert_${courseId}`, null) ||
        (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`lms_cert_${courseId}`) || 'null') : null);

      if (existingCert && existingCert.studentName) {
        setStudentName(existingCert.studentName);
        setNameInput(existingCert.studentName);
        setIsClaimed(true);
        if (existingCert.id) setCertHash(existingCert.id);
        if (existingCert.issueDate) setIssueDate(existingCert.issueDate);
        if (existingCert.signature) setSignature(existingCert.signature);
        return;
      }

      // 2. Otherwise load saved global student name if present
      const storedName = persistentStorage.getSync<string>('lms_student_name', '') ||
        (typeof window !== 'undefined' ? localStorage.getItem('lms_student_name') || '' : '');

      if (storedName) {
        setNameInput(storedName);
        setStudentName(storedName);
      }
    } catch {
      // ignore parsing errors
    }
  }, [isOpen, courseId]);

  // Compute signature automatically if already claimed but missing signature
  useEffect(() => {
    if (isClaimed && !signature && (studentName || nameInput)) {
      const activeName = (studentName || nameInput).trim();
      signCertificatePayload({
        certId: certHash,
        studentName: activeName,
        courseId,
        issueDate,
        grade: 'With Distinction',
      }).then(sig => {
        setSignature(sig);
      }).catch(err => {
        console.warn('Could not auto-generate signature:', err);
      });
    }
  }, [isClaimed, signature, studentName, nameInput, certHash, courseId, issueDate]);

  if (!isOpen) return null;

  const currentDisplayName = studentName.trim() || nameInput.trim() || 'Learner';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://encodeedge.com';

  const verifyUrl = signature
    ? buildVerifiedCertificateUrl(origin, {
        certId: certHash,
        studentName: currentDisplayName,
        courseId,
        issueDate,
        grade: 'With Distinction',
      }, signature)
    : `${origin}/verify/${certHash}?student=${encodeURIComponent(currentDisplayName)}&course=${encodeURIComponent(courseId)}&date=${encodeURIComponent(issueDate)}`;

  const handleClaimCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) return;

    const finalName = nameInput.trim();
    if (!finalName) return;

    setIsIssuing(true);
    setStudentName(finalName);
    setIsClaimed(true);
    setClaimSuccess(true);

    let generatedSig = '';
    let generatedUrl = '';

    try {
      // 1. Try server-side signing API (private key kept strictly on server)
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          courseTitle,
          studentName: finalName,
          certId: certHash,
          issueDate,
          grade: 'With Distinction',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        generatedSig = data.signature;
        generatedUrl = data.verifyUrl;
        setSignature(generatedSig);
      }
    } catch {
      // Offline fallback
    }

    // Fallback client-side signing if offline or endpoint not reachable
    if (!generatedSig) {
      try {
        generatedSig = await signCertificatePayload({
          certId: certHash,
          studentName: finalName,
          courseId,
          issueDate,
          grade: 'With Distinction',
        });
        generatedUrl = buildVerifiedCertificateUrl(origin, {
          certId: certHash,
          studentName: finalName,
          courseId,
          issueDate,
          grade: 'With Distinction',
        }, generatedSig);
        setSignature(generatedSig);
      } catch (err) {
        console.warn('Fallback signature error:', err);
      }
    }

    try {
      // 1. Store globally for subsequent certificates
      persistentStorage.set('lms_student_name', finalName);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lms_student_name', finalName);
      }

      // 2. Store specific course certificate record
      const certRecord = {
        id: certHash,
        courseId,
        courseTitle,
        studentName: finalName,
        issueDate,
        claimedAt: new Date().toISOString(),
        grade: 'Pass with Distinction',
        signature: generatedSig,
        verifyUrl: generatedUrl,
      };

      persistentStorage.set(`lms_cert_${courseId}`, certRecord);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`lms_cert_${courseId}`, JSON.stringify(certRecord));
      }

      // 3. Notify dashboard and other components
      window.dispatchEvent(new Event('lms_progress_updated'));
    } catch (err) {
      console.warn('Failed to save certificate record:', err);
    } finally {
      setIsIssuing(false);
    }

    setTimeout(() => {
      setClaimSuccess(false);
    }, 4000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard access fallback
    }
  };

  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    if (!isEligible) {
      alert('You must complete 100% of this course to print your official certificate.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${currentDisplayName} - ${courseTitle}</title>
          <style>
            @page { size: landscape; margin: 12mm; }
            * { box-sizing: border-box; }
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              background: #fff; 
              color: #111; 
              margin: 0; 
              padding: 20px; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 90vh; 
            }
            .print-box { 
              width: 100%; 
              max-width: 900px; 
              border: 8px double #d97706; 
              border-radius: 16px; 
              padding: 48px; 
              text-align: center; 
              background: #fffdf5; 
              position: relative;
            }
            h1 { font-family: Georgia, serif; font-size: 34px; margin: 12px 0; color: #1e293b; }
            h2 { 
              font-family: Georgia, serif; 
              font-size: 30px; 
              font-style: italic; 
              color: #0f172a; 
              margin: 16px 0; 
              border-bottom: 2px solid #cbd5e1; 
              display: inline-block; 
              padding-bottom: 8px; 
              min-width: 320px; 
            }
            h3 { font-size: 22px; color: #2563eb; margin: 16px 0; }
            p { font-size: 14px; color: #475569; line-height: 1.6; }
            .meta { 
              display: flex; 
              justify-content: space-around; 
              margin-top: 36px; 
              padding-top: 24px; 
              border-top: 1px solid #cbd5e1; 
            }
            .meta-item { text-align: center; }
            .sig { font-family: Georgia, serif; font-style: italic; font-size: 20px; color: #1e293b; }
            .meta-label { font-size: 11px; color: #64748b; margin-top: 4px; }
            .badge { font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #b45309; }
            .hash { font-family: monospace; font-size: 11px; color: #64748b; margin-bottom: 12px; }
            .sig-seal { font-family: monospace; font-size: 9px; color: #059669; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="print-box">
            <div class="hash">VERIFIED CREDENTIAL ID: ${certHash}</div>
            <div class="badge">✦ ENCODEEDGE LEARNING ACADEMY ✦</div>
            <h1>Certificate of Completion</h1>
            <p style="text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">This acknowledges that</p>
            <h2>${currentDisplayName}</h2>
            <p>has successfully completed all rigorous curriculum milestones, hands-on lab checkpoints, and production capstone projects for</p>
            <h3>${courseTitle}</h3>
            <div class="meta">
              <div class="meta-item">
                <div class="sig">Atul Jha</div>
                <div class="meta-label">Lead Instructor, EncodeEdge</div>
              </div>
              <div class="meta-item">
                <div class="sig">${issueDate}</div>
                <div class="meta-label">Date of Certification</div>
              </div>
            </div>
            ${signature ? `<div class="sig-seal">🔒 CRYPTOGRAPHICALLY SIGNED: ${signature.slice(0, 16)}...</div>` : ''}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-screen py-8 sm:py-12 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-3xl my-auto bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250 flex flex-col max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-6 border-b border-border flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-foreground leading-tight">
                Official Certificate of Completion
              </h3>
              <p className="text-[11px] text-muted-foreground truncate max-w-xs sm:max-w-md">
                {courseTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isClaimed && isEligible && (
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / Save PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close certificate modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Certificate Container */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 flex flex-col items-center space-y-6">
          
          {/* Eligibility Warning if course is incomplete */}
          {!isEligible && (
            <div className="w-full max-w-2xl p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs space-y-1">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Certificate Locked — Course Incomplete</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                You have completed <strong>{effectiveCompletedCount}</strong> {totalItems ? `of ${totalItems}` : ''} milestones. Official verified credentials with cryptographic proof are exclusively issued once all curriculum lessons, quizzes, and projects have been 100% completed.
              </p>
            </div>
          )}

          {/* Customizer / Claim Form Card */}
          <form 
            onSubmit={handleClaimCertificate} 
            className="w-full max-w-2xl p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/80 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label htmlFor="student-name-input" className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Recipient Name on Certificate</span>
              </label>
              {isClaimed && isEligible && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Claimed &amp; Authenticated</span>
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                id="student-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your full legal/professional name..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs disabled:opacity-60"
                autoFocus={!isClaimed && isEligible}
                disabled={!isEligible}
                required
              />
              <button
                type="submit"
                disabled={!isEligible || !nameInput.trim() || isIssuing}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isIssuing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Signing...</span>
                  </>
                ) : isEligible ? (
                  <>
                    <Award className="w-4 h-4" />
                    <span>{isClaimed ? 'Update Name' : 'Claim Certificate 🏆'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Course Incomplete</span>
                  </>
                )}
              </button>
            </div>

            {claimSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Certificate officially signed &amp; issued to <strong>{currentDisplayName}</strong>!</span>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground leading-normal">
              {isClaimed && isEligible
                ? 'Your verified credential has been cryptographically signed. You can update your name at any time or share your link below.'
                : isEligible
                ? 'Enter your name and click "Claim Certificate" to generate your tamper-proof credential with a cryptographic signature.'
                : 'Complete all required lessons in this course track to unlock official certification.'}
            </p>
          </form>

          {/* Certificate Canvas Frame */}
          <div 
            id="certificate-print-area"
            className="w-full max-w-2xl bg-gradient-to-br from-amber-50/70 via-background to-amber-50/50 dark:from-slate-900 dark:via-background dark:to-slate-900 border-8 border-double border-amber-600/35 rounded-2xl p-6 sm:p-10 text-center space-y-5 shadow-lg relative overflow-hidden"
          >
            {/* Watermark for Incomplete Courses */}
            {!isEligible && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[1.5px] pointer-events-none select-none">
                <div className="border-4 border-dashed border-amber-500/50 px-6 py-3 rounded-2xl -rotate-12 bg-card/90 shadow-xl text-center space-y-1">
                  <div className="font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 text-sm flex items-center justify-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    <span>UNOFFICIAL PREVIEW</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Course Incomplete • Complete to Earn Verified Credential
                  </div>
                </div>
              </div>
            )}

            {/* Watermark Seal */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-mono text-muted-foreground opacity-75">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{certHash}</span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EncodeEdge Learning Academy</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                Certificate of Completion
              </h1>
              <p className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                This acknowledges that
              </p>
            </div>

            {/* Recipient */}
            <div className="py-2 border-b border-border/80 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-foreground italic">
                {currentDisplayName}
              </h2>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              has successfully completed all rigorous curriculum milestones, hands-on lab checkpoints, and production capstone projects for
            </p>

            <h3 className="text-base sm:text-lg font-bold font-display text-primary max-w-md mx-auto leading-snug">
              {courseTitle}
            </h3>

            {/* Signatures & Date */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/60 max-w-md mx-auto text-xs">
              <div className="space-y-1 text-center">
                <div className="font-serif italic text-base text-foreground">Atul Jha</div>
                <div className="text-[10px] text-muted-foreground border-t border-border/60 pt-1">
                  Lead Instructor, EncodeEdge
                </div>
              </div>
              <div className="space-y-1 text-center">
                <div className="font-mono text-sm text-foreground">{issueDate}</div>
                <div className="text-[10px] text-muted-foreground border-t border-border/60 pt-1">
                  Date of Certification
                </div>
              </div>
            </div>

            {/* Digital Signature Footer */}
            {signature && isEligible && (
              <div className="pt-2 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 opacity-80 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Digitally Authenticated: {signature.slice(0, 16)}...</span>
              </div>
            )}

          </div>

          {/* Post-Claim Actions & Share Strip */}
          {isClaimed && isEligible && (
            <div className="w-full max-w-2xl bg-muted/20 border border-border/80 rounded-2xl p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-foreground font-mono">
                    Credential ID: {certHash}
                  </span>
                </div>
                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View Public Verification Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied Signed Link!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Copy Tamper-Proof Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ml-auto"
                >
                  <Printer className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
