import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  formula: string;
  caption?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ formula, caption }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula || '', {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return formula || '';
    }
  }, [formula]);

  return (
    <div className="my-6 rounded-2xl bg-card border border-border p-4 shadow-xs text-foreground not-prose text-center overflow-x-auto">
      <div dangerouslySetInnerHTML={{ __html: html }} className="py-2 inline-block text-base sm:text-lg" />
      {caption && (
        <div className="text-xs font-mono text-muted-foreground mt-2 border-t border-border/50 pt-2">
          {caption}
        </div>
      )}
    </div>
  );
};
