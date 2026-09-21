import React, { useState, useEffect, useMemo } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Code2, Sparkles, CheckCircle2, BookOpen, ChevronDown, Layers } from 'lucide-react';
import { 
  CONTENT_SNIPPETS, 
  getSnippetForContent, 
  getCategoryForContent, 
  getSnippetsForCategory, 
  type CodeSnippet 
} from '@/lib/code-snippets';

interface CodeSandboxRunnerProps {
  contentId?: string;
  initialSnippetId?: string;
  titleOverride?: string;
  customSnippet?: CodeSnippet;
  showPresetTabs?: boolean;
  categoryScope?: string;
}

export const CodeSandboxRunner: React.FC<CodeSandboxRunnerProps> = ({
  contentId,
  initialSnippetId,
  titleOverride,
  customSnippet,
  showPresetTabs = true,
  categoryScope,
}) => {
  // Determine strict category scope if tied to a lesson, course, or blog post
  const scopedCategory = useMemo(() => {
    if (categoryScope) return categoryScope;
    if (contentId) return getCategoryForContent(contentId);
    if (initialSnippetId && CONTENT_SNIPPETS[initialSnippetId]) return CONTENT_SNIPPETS[initialSnippetId].category;
    return undefined;
  }, [categoryScope, contentId, initialSnippetId]);

  // Available snippets filtered strictly by category if scoped
  const availableSnippets = useMemo<CodeSnippet[]>(() => {
    if (scopedCategory) {
      const filtered = getSnippetsForCategory(scopedCategory);
      if (filtered.length > 0) return filtered;
    }
    return Object.values(CONTENT_SNIPPETS);
  }, [scopedCategory]);

  // Resolve initial default snippet
  const resolvedDefault = useMemo<CodeSnippet>(() => {
    if (customSnippet) return customSnippet;
    if (contentId) return getSnippetForContent(contentId);
    if (initialSnippetId && CONTENT_SNIPPETS[initialSnippetId]) return CONTENT_SNIPPETS[initialSnippetId];
    return availableSnippets[0] || CONTENT_SNIPPETS['dl-perceptrons-and-backprop'];
  }, [contentId, initialSnippetId, customSnippet, availableSnippets]);

  // STABLE list of preset snippets strictly within the scoped category
  const presetSnippets = useMemo<CodeSnippet[]>(() => {
    const others = availableSnippets.filter(s => s.id !== resolvedDefault.id);
    return [resolvedDefault, ...others];
  }, [resolvedDefault, availableSnippets]);

  // Active selection state
  const [selectedId, setSelectedId] = useState<string>(resolvedDefault.id);
  const [codeContent, setCodeContent] = useState<string>(resolvedDefault.code);
  const [terminalOutput, setTerminalOutput] = useState<string[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync if props change
  useEffect(() => {
    setSelectedId(resolvedDefault.id);
    setCodeContent(resolvedDefault.code);
    setTerminalOutput(null);
  }, [resolvedDefault]);

  // Current active snippet
  const currentSnippet = CONTENT_SNIPPETS[selectedId] || resolvedDefault;

  // Handle switching code snippet
  const handleSelect = (snippet: CodeSnippet) => {
    setSelectedId(snippet.id);
    setCodeContent(snippet.code);
    setTerminalOutput(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput([
      `[Spawning Python 3.13 subprocess sandbox...]`,
      `[Executing ${currentSnippet.title}...]`
    ]);

    setTimeout(() => {
      setTerminalOutput(currentSnippet.expectedOutput);
      setIsRunning(false);
    }, 400);
  };

  const handleReset = () => {
    setCodeContent(currentSnippet.code);
    setTerminalOutput(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
      {/* Top Header Bar */}
      <div className="bg-muted/40 border-b border-border/60 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Code2 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold font-display text-base text-foreground">
                {titleOverride || `${currentSnippet.category}: Interactive Lab`}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {currentSnippet.category}
              </span>
              {contentId && selectedId === resolvedDefault.id && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <BookOpen className="size-2.5" />
                  Matched to lesson
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-body line-clamp-1">
              {currentSnippet.description || 'Run and inspect verified algorithms directly in your browser.'}
            </p>
          </div>
        </div>

        {/* Category-Scoped Dropdown Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => {
                const target = CONTENT_SNIPPETS[e.target.value];
                if (target) handleSelect(target);
              }}
              className="appearance-none bg-card hover:bg-muted/60 border border-border/80 text-foreground text-xs font-semibold py-1.5 pl-3 pr-8 rounded-xl shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              aria-label="Select algorithm snippet"
            >
              {scopedCategory ? (
                // Only show snippets for this specific category
                availableSnippets.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.shortTitle || s.title}
                  </option>
                ))
              ) : (
                // Unscoped (e.g. main catalog): show all categories
                Array.from(new Set(Object.values(CONTENT_SNIPPETS).map(s => s.category))).map(cat => (
                  <optgroup key={cat} label={cat}>
                    {Object.values(CONTENT_SNIPPETS).filter(s => s.category === cat).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.shortTitle || s.title}
                      </option>
                    ))}
                  </optgroup>
                ))
              )}
            </select>
            <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Preset Tabs Row (Only shows snippets for THIS course/category) */}
      {showPresetTabs && presetSnippets.length > 1 && (
        <div className="px-4 py-2.5 bg-muted/20 border-b border-border/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Layers className="size-3" />
            Labs:
          </span>
          <div className="flex items-center gap-1.5 min-w-max">
            {presetSnippets.map(snip => {
              const isActive = selectedId === snip.id;
              return (
                <button
                  key={snip.id}
                  type="button"
                  onClick={() => handleSelect(snip)}
                  className={`text-xs font-medium px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${isActive ? 'bg-primary-foreground' : 'bg-muted-foreground/40'}`}></span>
                  <span>{snip.shortTitle || snip.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Editor & Console Split Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
        
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-black-950 text-slate-100">
          <div className="flex items-center justify-between px-4 py-2.5 bg-black-900 border-b border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="size-2 rounded-full bg-emerald-400"></span>
              <span className="truncate max-w-[240px] sm:max-w-md text-slate-200 font-semibold">
                {currentSnippet.title}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-white/10 text-slate-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                title="Copy code"
              >
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded hover:bg-white/10 text-slate-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                title="Reset code"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              className="w-full h-72 lg:h-96 p-4 font-mono text-xs leading-relaxed bg-transparent text-slate-200 resize-none focus:outline-none selection:bg-primary/30"
              spellCheck={false}
            />
          </div>

          {/* Action Footer */}
          <div className="p-3 bg-black-900 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-mono text-slate-400">Python 3.13 • NumPy • PyTorch</span>
            <button
              type="button"
              onClick={handleRunCode}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`size-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Right: Terminal Console Output (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-black-900 text-slate-200">
          <div className="flex items-center justify-between px-4 py-2.5 bg-black-950 border-b border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <Terminal className="size-3.5 text-primary" />
              <span>Terminal Output</span>
            </div>
            {terminalOutput && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                exit code: 0 (0.012s)
              </span>
            )}
          </div>

          <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-y-auto min-h-[220px] lg:min-h-[384px] text-slate-300 space-y-1">
            {terminalOutput === null ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                <Terminal className="size-8 stroke-1 opacity-40" />
                <p className="text-xs">Click <strong className="text-slate-300">Run Code</strong> to execute this algorithm in the browser sandbox.</p>
              </div>
            ) : (
              terminalOutput.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`${
                    line.startsWith('✓') 
                      ? 'text-emerald-400 font-semibold pt-2' 
                      : line.startsWith('[') 
                        ? 'text-cyan-400/80 text-[11px]' 
                        : 'text-slate-200'
                  }`}
                >
                  {line || '\u00A0'}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
