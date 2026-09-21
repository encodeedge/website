import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizBlockProps {
  question: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
  correctAnswer?: number; // 0-based index or 1-based (we handle both: default 0 or 1)
  correctIndex?: number;
  explanation?: string;
}

export const QuizBlock: React.FC<QuizBlockProps> = ({
  question,
  option1,
  option2,
  option3,
  option4,
  correctAnswer = 0,
  correctIndex,
  explanation,
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Normalize correct answer index (0-based)
  const targetIndex = correctIndex !== undefined ? correctIndex : (correctAnswer > 0 && correctAnswer <= 4 ? correctAnswer - 1 : correctAnswer);

  const options = [option1, option2, option3, option4].filter(Boolean) as string[];

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const isCorrect = selected === targetIndex;

  return (
    <div className="my-8 rounded-2xl border border-black-200 dark:border-black-800 bg-black-50 dark:bg-black-900/60 p-6 not-prose shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-tag-blue px-3 py-1 text-xs font-semibold text-black">
          <HelpCircle className="size-3.5" />
          Knowledge Check
        </span>
        {submitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            Try again
          </button>
        )}
      </div>

      <h4 className="text-lg font-bold font-display tracking-tight text-foreground mb-4">
        {question}
      </h4>

      <div className="flex flex-col gap-2.5">
        {options.map((opt, idx) => {
          let btnStyle = "border-border bg-background hover:bg-black-100 dark:hover:bg-black-800 text-foreground";
          let icon = null;

          if (submitted) {
            if (idx === targetIndex) {
              btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold";
              icon = <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-auto" />;
            } else if (idx === selected) {
              btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 font-semibold";
              icon = <XCircle className="size-5 text-rose-600 dark:text-rose-400 shrink-0 ml-auto" />;
            } else {
              btnStyle = "opacity-50 border-border bg-background text-muted-foreground";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={submitted}
              className={cn(
                "flex items-center justify-between rounded-xl border p-4 text-left text-sm transition-all duration-150 cursor-pointer",
                btnStyle,
              )}
            >
              <span className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-black-100 dark:bg-black-800 text-xs font-semibold text-black dark:text-white shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </span>
              {icon}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div
          className={cn(
            "mt-4 rounded-xl border p-4 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300",
            isCorrect
              ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
              : "border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100",
          )}
        >
          <div className="font-semibold mb-1">
            {isCorrect ? "Correct! Well done." : "Incorrect."}
          </div>
          {explanation && <div>{explanation}</div>}
        </div>
      )}
    </div>
  );
};
export default QuizBlock;

