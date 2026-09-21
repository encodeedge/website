import React, { useState } from 'react';
import { Award, X, Printer, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface CourseCertificateModalProps {
  courseTitle: string;
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseCertificateModal: React.FC<CourseCertificateModalProps> = ({
  courseTitle,
  courseId,
  isOpen,
  onClose,
}) => {
  const [studentName, setStudentName] = useState('Valued Learner');
  const [isCustomizing, setIsCustomizing] = useState(false);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const certHash = `EE-${courseId.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold font-display text-foreground">
              Official Certificate of Completion
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Container (Formatted for print) */}
        <div className="p-6 md:p-10 overflow-y-auto flex-1 flex flex-col items-center">
          
          {/* Customizer Input */}
          <div className="w-full max-w-md mb-6 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground whitespace-nowrap">Your Full Name:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name for certificate..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Certificate Canvas Frame */}
          <div 
            id="certificate-print-area"
            className="w-full max-w-2xl bg-gradient-to-br from-amber-50/60 via-background to-amber-50/40 dark:from-slate-900 dark:via-background dark:to-slate-900 border-8 border-double border-amber-600/30 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-md relative"
          >
            {/* Watermark Seal */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-mono text-muted-foreground opacity-60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{certHash}</span>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>EncodeEdge Learning Academy</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
                Certificate of Completion
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                This acknowledges that
              </p>
            </div>

            {/* Recipient */}
            <div className="py-2 border-b border-border/80 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-foreground italic">
                {studentName || 'Learner'}
              </h2>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              has successfully completed all rigorous curriculum milestones, hands-on lab checkpoints, and production capstone projects for
            </p>

            <h3 className="text-lg sm:text-xl font-bold font-display text-primary max-w-md mx-auto">
              {courseTitle}
            </h3>

            {/* Signatures & Date */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/60 max-w-md mx-auto text-xs">
              <div className="space-y-1 text-center">
                <div className="font-serif italic text-base text-foreground">Atul Jha</div>
                <div className="text-[11px] text-muted-foreground border-t border-border/60 pt-1">
                  Lead Instructor, EncodeEdge
                </div>
              </div>
              <div className="space-y-1 text-center">
                <div className="font-mono text-sm text-foreground">{issueDate}</div>
                <div className="text-[11px] text-muted-foreground border-t border-border/60 pt-1">
                  Date of Certification
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

