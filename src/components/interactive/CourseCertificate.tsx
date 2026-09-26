import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Award, Download, Share2, Check, X, QrCode, ExternalLink, Sparkles, Shield, Copy } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface CertificateData {
  studentName: string;
  courseTitle: string;
  completionDate: string; // ISO
  instructorName?: string;
  courseId: string;
  grade?: 'pass' | 'distinction' | 'honors';
  totalHours?: number;
}

// ─── Verification URL ────────────────────────────────────────────────────────
function generateVerificationId(courseId: string, studentName: string, date: string): string {
  const raw = `${courseId}-${studentName.toLowerCase().replace(/\s+/g, '-')}-${date.slice(0, 10)}`;
  // Simple hash for a readable ID (not cryptographically secure — for display only)
  let h = 0;
  for (let i = 0; i < raw.length; i++) { h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0; }
  const hex = Math.abs(h).toString(16).padStart(8, '0').toUpperCase();
  return `EE-${hex.slice(0, 4)}-${hex.slice(4)}`;
}

function getVerificationUrl(id: string): string {
  return `${typeof window !== 'undefined' ? window.location.origin : 'https://encodeedge.com'}/verify/${id}`;
}

// ─── Grade config ─────────────────────────────────────────────────────────────
const GRADE_CONFIG = {
  pass: { label: 'Passed', color: '#3b82f6', badge: '✓', ribbon: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  distinction: { label: 'With Distinction', color: '#f59e0b', badge: '★', ribbon: 'linear-gradient(135deg, #f59e0b, #b45309)' },
  honors: { label: 'With Honors', color: '#8b5cf6', badge: '◆', ribbon: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
};

// ─── Certificate Preview (SVG-based, pixel-perfect) ──────────────────────────
const CertificatePreview = ({ data, verificationId }: { data: CertificateData; verificationId: string }) => {
  const grade = data.grade ? GRADE_CONFIG[data.grade] : GRADE_CONFIG.pass;
  const dateStr = new Date(data.completionDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div
      className="w-full aspect-[1.414/1] rounded-2xl overflow-hidden shadow-2xl relative font-serif select-none"
      style={{ background: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)', border: '1px solid #e7e5e4' }}
    >
      {/* Decorative border */}
      <div className="absolute inset-3 rounded-xl" style={{ border: '2px solid #d6d3d1' }} />
      <div className="absolute inset-5 rounded-lg" style={{ border: '1px solid #e7e5e4' }} />

      {/* Corner ornaments */}
      {[['top-6 left-6', ''], ['top-6 right-6', 'scale-x-[-1]'], ['bottom-6 left-6', 'scale-y-[-1]'], ['bottom-6 right-6', '-scale-100']].map(([pos, scale], i) => (
        <div key={i} className={`absolute ${pos} ${scale} w-8 h-8 opacity-30`}
          style={{ background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M0 0 Q16 0 16 16 Q0 16 0 0Z' fill='%238b7355'/%3E%3C/svg%3E")` }}
        />
      ))}

      {/* Grade ribbon */}
      <div
        className="absolute top-0 right-0 px-5 py-1.5 text-white text-xs font-bold tracking-wider"
        style={{ background: grade.ribbon, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10% 100%)' }}
      >
        {grade.badge} {grade.label}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-12 text-center gap-2 z-10">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <span className="text-white text-xs font-black">EE</span>
          </div>
          <span className="font-sans text-sm font-bold text-slate-700 tracking-widest uppercase">EncodeEdge</span>
        </div>

        <p className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.3em] mt-1">Certificate of Completion</p>

        <div className="w-16 h-px bg-stone-300 my-2" />

        <p className="font-sans text-xs text-stone-500">This certifies that</p>
        <h1
          className="text-3xl font-bold tracking-wide leading-tight"
          style={{ color: '#1c1917', fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        >
          {data.studentName}
        </h1>

        <p className="font-sans text-xs text-stone-500 mt-1">has successfully completed the course</p>
        <h2
          className="text-lg font-bold leading-tight max-w-xs"
          style={{ color: grade.color, fontFamily: 'Georgia, serif' }}
        >
          {data.courseTitle}
        </h2>

        {data.totalHours && (
          <p className="font-sans text-[10px] text-stone-400">{data.totalHours} hours of coursework</p>
        )}

        <div className="w-16 h-px bg-stone-300 my-2" />

        <div className="flex items-end justify-between w-full max-w-xs px-4">
          <div className="text-center">
            <div className="w-24 h-px bg-stone-400 mb-1" />
            <p className="font-sans text-[9px] text-stone-400 uppercase tracking-wider">Instructor</p>
            <p className="font-sans text-[11px] font-semibold text-stone-600">{data.instructorName || 'Atul Jha'}</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-px bg-stone-400 mb-1" />
            <p className="font-sans text-[9px] text-stone-400 uppercase tracking-wider">Date Issued</p>
            <p className="font-sans text-[11px] font-semibold text-stone-600">{dateStr}</p>
          </div>
        </div>

        {/* Verification ID */}
        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200">
          <Shield className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="font-mono text-[9px] text-stone-500 tracking-wider">ID: {verificationId}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface CourseCertificateProps {
  courseId: string;
  courseTitle: string;
  instructorName?: string;
  totalHours?: number;
  /** If provided, component shows inline. If not provided, shows as floating trigger. */
  mode?: 'inline' | 'modal';
}

export const CourseCertificate = ({
  courseId,
  courseTitle,
  instructorName = 'Atul Jha',
  totalHours,
  mode = 'modal',
}: CourseCertificateProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'preview' | 'done'>('form');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<'pass' | 'distinction' | 'honors'>('pass');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Check if this course was completed
  const isCompleted = (() => {
    try {
      const key = `lms_completed_${courseId}`;
      const val = localStorage.getItem(key);
      if (!val) return false;
      const list: string[] = JSON.parse(val);
      return list.length > 0;
    } catch { return false; }
  })();

  const certData: CertificateData = {
    studentName: name || 'Your Name',
    courseTitle,
    completionDate: new Date().toISOString(),
    instructorName,
    courseId,
    grade,
    totalHours,
  };

  const verificationId = generateVerificationId(courseId, name || 'learner', new Date().toISOString());
  const verificationUrl = getVerificationUrl(verificationId);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const downloadCert = () => {
    // Trigger browser print-to-PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const certEl = document.getElementById('cert-print-target');
    if (!certEl) return;
    printWindow.document.write(`
      <html><head><title>Certificate - ${courseTitle}</title>
      <style>@page{margin:0} body{margin:0;padding:0;background:#fff} #cert-root{width:297mm;height:210mm;overflow:hidden;}</style>
      </head><body><div id="cert-root">${certEl.outerHTML}</div></body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const TriggerButton = () => (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
    >
      <Award className="w-4 h-4" />
      Generate Certificate
      <Sparkles className="w-3.5 h-3.5 opacity-70" />
    </button>
  );

  const Modal = () => createPortal(
    <div className="fixed inset-0 z-[10060] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="font-bold text-foreground">Course Certificate</div>
              <div className="text-xs text-muted-foreground">{courseTitle}</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {step === 'form' && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">Customize your certificate before generating it.</p>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Your Full Name (as it will appear on the certificate)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Achievement Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(GRADE_CONFIG) as [string, typeof GRADE_CONFIG.pass][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setGrade(key as typeof grade)}
                      className={`p-3 rounded-xl border text-sm font-semibold transition-all text-center ${
                        grade === key ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40 text-foreground'
                      }`}
                    >
                      <div className="text-xl mb-1">{cfg.badge}</div>
                      <div>{cfg.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep('preview')}
                disabled={!name.trim()}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Preview Certificate →
              </button>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div id="cert-print-target">
                <CertificatePreview data={certData} verificationId={verificationId} />
              </div>

              {/* Verification */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/60 border border-border/60">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground">Verification ID: <span className="font-mono text-primary">{verificationId}</span></div>
                  <div className="text-[10px] text-muted-foreground truncate">Shareable: {verificationUrl}</div>
                </div>
                <button onClick={copyLink} className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
              </div>

              {/* Share */}
              <div className="flex gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}&title=${encodeURIComponent(`I just completed ${courseTitle}!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-500/30 text-blue-600 font-semibold text-sm hover:bg-blue-500/10 transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Share on LinkedIn
                </a>
                <button
                  onClick={downloadCert}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>

              <button onClick={() => setStep('form')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                ← Edit details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );

  if (!mounted) return null;

  if (mode === 'inline') {
    return (
      <div className="space-y-4">
        {step === 'form' && <TriggerButton />}
        {open && <Modal />}
      </div>
    );
  }

  return (
    <>
      <TriggerButton />
      {open && <Modal />}
    </>
  );
};

export default CourseCertificate;
