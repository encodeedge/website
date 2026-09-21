import React from 'react';
import { CodeSandboxRunner } from '@/components/interactive/CodeSandboxRunner';

interface CodeSandboxProps {
  snippetId?: string;
  category?: string;
  title?: string;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({ snippetId, category, title }) => {
  const categoryScope = category && category !== 'auto' ? category : undefined;
  return (
    <div className="my-8 not-prose">
      <CodeSandboxRunner
        initialSnippetId={snippetId}
        categoryScope={categoryScope}
        titleOverride={title}
      />
    </div>
  );
};

