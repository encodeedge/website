export default function rehypeUnescapeBracesMath() {
  return (tree) => {
    console.log('[rehype-unescape-braces-math] Plugin invoked');
    function visit(node) {
      if (!node || typeof node !== 'object') return;

      const isMathNode =
        node.type === 'inlineMath' ||
        node.type === 'math' ||
        node.type === 'mdxTextExpression' ||
        node.type === 'mdxFlowExpression' ||
        node.type === 'text';

      if (isMathNode && typeof node.value === 'string') {
        const before = node.value;
        if (/\\[\{\}\[\]_]/.test(before)) {
          node.value = before
            .replace(/\\\{/g, '{')
            .replace(/\\\}/g, '}')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']')
            .replace(/\\\_/g, '_');
          console.log(
            `[rehype-unescape-braces-math] Parsed node.type: ${node.type}, before: "${before}", after: "${node.value}"`
          );
        }
      }
      if (Array.isArray(node.children)) for (const c of node.children) visit(c);
    }
    visit(tree);
  };
}
