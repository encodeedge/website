// remark plugin: unescape braces inside math nodes only
export default function remarkUnescapeBracesMath() {
  return (tree) => {
    function visit(node) {
      if (!node || typeof node !== 'object') return;

      // Helper to unescape only when TeX-like patterns exist to avoid touching normal text
      const shouldUnescape = (str) => {
        if (typeof str !== 'string') return false;
        if (!/\\\{/.test(str) && !/\\\}/.test(str)) return false;
        // look for common TeX commands or math symbols
        if (/\\[a-zA-Z]+/.test(str)) return true; // e.g. \\frac, \\alpha
        if (/[\^_{}]/.test(str)) return true;
        return false;
      };

      if (typeof node.value === 'string' && (node.type === 'inlineMath' || node.type === 'math' || node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression' || node.type === 'text')) {
        if (shouldUnescape(node.value)) {
          node.value = node.value
            .replace(/\\\{/g, '{')
            .replace(/\\\}/g, '}')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']');
        }
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) visit(child);
      }
    }
    visit(tree);
  };
}
