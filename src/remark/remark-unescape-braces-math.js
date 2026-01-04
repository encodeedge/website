// remark plugin: unescape braces inside math nodes only
export default function remarkUnescapeBracesMath() {
  return (tree) => {
    function visit(node) {
      if (!node || typeof node !== 'object') return;

      if (
        typeof node.value === 'string' &&
        (node.type === 'inlineMath' ||
          node.type === 'math' ||
          node.type === 'mdxTextExpression' ||
          node.type === 'mdxFlowExpression' ||
          node.type === 'text')
      ) {
        const before = node.value;
        if (/\\[\{\}\[\]_]/.test(before)) {
          node.value = before
            .replace(/\\\{/g, '{')
            .replace(/\\\}/g, '}')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']')
            .replace(/\\\_/g, '_');
          console.log(
            `[remark-unescape-braces-math] Parsed node.type: ${node.type}, before: "${before}", after: "${node.value}"`
          );
        }
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) visit(child);
      }
    }
    visit(tree);
  };
}
