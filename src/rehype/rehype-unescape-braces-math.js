export default function rehypeUnescapeBracesMath() {
  return (tree) => {
    function visit(node) {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'text' && typeof node.value === 'string') {
        const s = node.value;
        if (!/\\\{|\\\}|\\\[|\\\]/.test(s)) return;
        // Conservative check for TeX-like content
        if (/\\[a-zA-Z]+/.test(s) || /[\^_{}\[\]]/.test(s)) {
          node.value = s
            .replace(/\\\{/g, '{')
            .replace(/\\\}/g, '}')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']');
        }
      }
      if (Array.isArray(node.children)) for (const c of node.children) visit(c);
    }
    visit(tree);
  };
}
