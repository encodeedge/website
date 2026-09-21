import React, { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";

interface CodeSnippetProps {
  language?: string;
  filename?: string;
  code: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  language = "python",
  filename,
  code,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-black-200 dark:border-black-800 bg-[#1e1e24] text-white not-prose shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 bg-black/40 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-ghost-accent" />
          <span className="font-mono text-white/90 font-medium">
            {filename || `${language} snippet`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed bg-transparent m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
};
export default CodeSnippet;

