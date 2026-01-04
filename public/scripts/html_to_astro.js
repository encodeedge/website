#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import shiki from 'shiki';

function declassifyHighlightedCode(html) {
  return html.replace(/<div[^>]*class=["']?highlight[^"'>]*["']?[^>]*>\s*<pre[^>]*>([\s\S]*?)<\/pre>\s*<\/div>/gi, (m, code) => {
    let text = code.replace(/<\/?span[^>]*>/gi, '');
    text = text.replace(/<div[^>]*class=["']?cm-editor[^"'>]*["']?[^>]*>/gi, '');
    text = text.replace(/<\/div>\s*$/gi, '');
    text = text.replace(/&nbsp;/g, ' ');
    return `<pre><code class="language-python">${text}</code></pre>`;
  });
}

function titleize(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const args = process.argv.slice(2);
let inputs = [];
if (args.length === 0) {
  const dir = path.resolve('src', 'notebooks');
  if (!fs.existsSync(dir)) {
    console.error('No input specified and src/notebooks does not exist');
    process.exit(1);
  }
  inputs = fs.readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => path.join(dir, f));
} else {
  for (const a of args) {
    const p = path.resolve(a);
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      const files = fs.readdirSync(p).filter((f) => f.endsWith('.html')).map((f) => path.join(p, f));
      inputs.push(...files);
    } else {
      inputs.push(p);
    }
  }
}

if (inputs.length === 0) {
  console.error('No HTML files found to convert');
  process.exit(1);
}

const outDir = path.resolve('src', 'pages', 'notebooks');
fs.mkdirSync(outDir, { recursive: true });

// Initialize shiki highlighter
const highlighter = await shiki.getHighlighter({ theme: 'github-dark' });

function applyShiki(html) {
  return html.replace(/<pre>\s*<code class="language-([^"']+)">([\s\S]*?)<\/code>\s*<\/pre>/gi, (m, lang, code) => {
    const decoded = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    try {
      return highlighter.codeToHtml(decoded, { lang });
    } catch (e) {
      return `<pre><code class="language-${lang}">${decoded}</code></pre>`;
    }
  });
}

for (const input of inputs) {
  if (!fs.existsSync(input)) {
    console.warn('Skipping missing file', input);
    continue;
  }

  const ext = path.extname(input).toLowerCase();
  if (ext === '.ipynb') {
    const templatePath = path.resolve('public', 'scripts', 'nbconvert_templates', 'astro.tpl');
    const base = path.basename(input, '.ipynb');
    const outPath = path.join(outDir, base + '.astro');
    try {
      const cmd = `py -m nbconvert --to html --template "${templatePath}" --output "${outPath}" "${input}"`;
      console.log('Running:', cmd);
      execSync(cmd, { stdio: 'inherit' });
      console.log('Wrote', outPath);
    } catch (err) {
      console.error('nbconvert failed:', err.message);
    }
    continue;
  }

  const raw = fs.readFileSync(input, 'utf8');
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  let body = bodyMatch ? bodyMatch[1] : raw;
  body = body.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  body = body.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  body = declassifyHighlightedCode(body);
  body = body.replace(/<main[^>]*>/gi, '');
  body = body.replace(/<\/main>/gi, '');

  const title = titleMatch ? titleMatch[1].trim() : titleize(path.basename(input, '.html'));
  const description = `${title} — Notebook export`;

  const highlighted = applyShiki(body);

  // Build .astro output using JSON-stringified values to avoid template interpolation issues
  const astroParts = [];
  astroParts.push('---');
  astroParts.push("import { getCollection } from 'astro:content';");
  astroParts.push("import { format } from 'date-fns';");
  astroParts.push("import DefaultLayout from '@/layouts/DefaultLayout.astro';");
  astroParts.push('const title = ' + JSON.stringify(title) + ';');
  astroParts.push('const description = ' + JSON.stringify(description) + ';');
  astroParts.push("// Static metadata used to render the hero + featured sidebar (edit as needed)");
  astroParts.push("const authorName = 'Atul Jha';");
  astroParts.push("const authorImage = '/assets/introduction-to-machine-learning/authorImage.png';");
  astroParts.push("const pubDate = '2025-01-01';");
  astroParts.push("const tags = ['notebook'];");
  astroParts.push("const topics = ['sample-topic', 'example-topic'];");
  astroParts.push("const image = '';");
  astroParts.push("const featured = [{ id: 'linear-regression', data: { title: 'Linear Regression', pubDate: '2025-01-01', image: '' } }];");
  astroParts.push('');
  astroParts.push("const _allPosts = await getCollection('blog');");
  astroParts.push('const featuredPosts = _allPosts.filter((p) => p.data?.featured).sort((a,b)=> new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()).slice(0,5);');
  astroParts.push('const content = ' + JSON.stringify(highlighted) + ';');
  astroParts.push('---');

  astroParts.push('<DefaultLayout title={title} description={description}>');
  astroParts.push('  <div class="py-28 lg:pt-44 lg:pb-32">');
  astroParts.push('    <!-- Hero: title, description, author, tags, cover image -->');
  astroParts.push('    <div class="container">');
  astroParts.push('      <div class="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">');
  astroParts.push('        <h1 class="max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>');
  astroParts.push('        <h3 class="text-muted-foreground max-w-4xl">{description}</h3>');
  astroParts.push('        <div class="flex items-center gap-3 text-sm md:text-base">');
  astroParts.push('          {authorImage ? (');
  astroParts.push('            <img src={authorImage} alt={authorName} class="h-8 w-8 rounded-full border" />');
  astroParts.push('          ) : (');
  astroParts.push("            <div class=\"h-8 w-8 rounded-full bg-muted-foreground/10 flex items-center justify-center text-xs font-semibold text-muted-foreground\">{authorName ? authorName.charAt(0) : ''}</div>");
  astroParts.push('          )}');
  astroParts.push('          <span>');
  astroParts.push("            <a href={'/authors/' + (authorName ? authorName.replace(/\\s+/g, '-').toLowerCase() : '')} class=\"font-semibold\">{authorName}</a>");
  astroParts.push("            <span class=\"ml-1\">on {format(new Date(pubDate), 'MMM d, yyyy')}</span>");
  astroParts.push('          </span>');
  astroParts.push('        </div>');
  astroParts.push('        <div class="flex flex-wrap justify-center gap-2 mt-4 mb-4">');
  astroParts.push("          {tags && tags.map((tag) => (<a href={'/tags/' + tag} class=\"px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition\">{tag}</a>))}");
  astroParts.push("          {topics && topics.map((topic) => (<a href={'/topics/' + topic} class=\"px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition\">{topic}</a>))}");
  astroParts.push('        </div>');
  astroParts.push("        {image ? <img src={image} alt={title} class=\"mt-0 mb-8 aspect-video w-full rounded-lg border object-cover\" /> : null}");
  astroParts.push('      </div>');
  astroParts.push('    </div>');
  astroParts.push('');
  astroParts.push('    <div class="w-full">');
  astroParts.push('      <div id="notebook-progress" class="fixed top-0 left-0 right-0 h-1 bg-muted z-50">');
  astroParts.push('        <div id="notebook-progress-bar" class="h-full bg-gradient-to-r from-sidebar-primary via-sidebar-primary to-blue-500 transition-all duration-300" style="width:0%"></div>');
  astroParts.push('      </div>');
  astroParts.push('');
  astroParts.push('      <div class="grid w-full max-w-12xl mx-auto px-8 grid-cols-1 gap-8 lg:grid-cols-[14rem_minmax(0,100ch)_14rem] items-start justify-center">');
  astroParts.push('        <!-- Left side: section navigation (populated by client script) -->');
  astroParts.push('        <aside class="hidden lg:block sticky top-24 h-fit">');
  astroParts.push('          <div class="bg-gradient-to-b from-muted/5 via-transparent to-background/60 border border-border rounded-xl p-4 shadow-lg max-h-[calc(100vh-6rem)] overflow-auto backdrop-blur-sm">');
  astroParts.push('            <div class="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">On this page</div>');
  astroParts.push('            <ul id="notebook-toc" class="space-y-1 list-none pl-0">');
  astroParts.push('              <li class="text-sm text-muted-foreground">(No sections)</li>');
  astroParts.push('            </ul>');
  astroParts.push('          </div>');
  astroParts.push('        </aside>');
  astroParts.push('');
  astroParts.push('        <main class="w-full">');
  astroParts.push('          <div class="prose dark:prose-invert mx-auto max-w-none w-full notebook-embed" set:html={content} />');
  astroParts.push('        </main>');
  astroParts.push('');
  astroParts.push('        <!-- Right side: featured (placeholder) -->');
  astroParts.push('        <aside class="hidden lg:block sticky top-24 h-fit">');
  astroParts.push('            <div class="bg-gradient-to-b from-background/60 via-transparent to-muted/5 border border-border rounded-xl p-4 shadow-lg overflow-auto backdrop-blur-sm" style="max-height: min(calc(100vh - 6rem), 36rem);">');
  astroParts.push('              <div class="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Featured</div>');
  astroParts.push('              <ul id="notebook-featured" class="space-y-3 list-none">');
  astroParts.push('                {featuredPosts && featuredPosts.length > 0 ? (');
  astroParts.push('                  featuredPosts.map((f) => (');
  astroParts.push('                    <li>');
  astroParts.push("                      <a href={'/blog/' + f.id} class=\"flex items-start gap-3 rounded-lg p-3 hover:bg-muted/5 transition-shadow duration-150\"> ");
  astroParts.push('                        {f.data.image ? (');
  astroParts.push('                          <img src={f.data.image} alt={f.data.title} class="h-12 w-14 rounded-md object-cover border shrink-0" />');
  astroParts.push('                        ) : (');
  astroParts.push("                          <div class=\"h-12 w-12 rounded-md bg-muted-foreground/10 flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0\">{f.data.title ? f.data.title.charAt(0) : ''}</div>");
  astroParts.push('                        )}');
  astroParts.push('                        <div class="flex-1 min-w-0">');
  astroParts.push('                          <div class="text-sm font-semibold text-foreground line-clamp-2">{f.data.title}</div>');
  astroParts.push("                          <div class=\"text-xs text-muted-foreground\">{format(new Date(f.data.pubDate), 'MMM d, yyyy')}</div>");
  astroParts.push('                        </div>');
  astroParts.push('                      </a>');
  astroParts.push('                    </li>');
  astroParts.push('                  ))');
  astroParts.push('                ) : (');
  astroParts.push('                  <li class="text-sm text-muted-foreground">(No featured posts)</li>');
  astroParts.push('                )}');
  astroParts.push('              </ul>');
  astroParts.push('            </div>');
  astroParts.push('        </aside>');
  astroParts.push('      </div>');
  astroParts.push('    </div>');
  astroParts.push('');
  astroParts.push('    <script type="module">');
  astroParts.push('      const slugify = (text) =>');
  astroParts.push("        text.toLowerCase().trim().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').replace(/-+/g, '-');");
  astroParts.push('');
  astroParts.push('      const buildToc = () => {');
  astroParts.push("        const container = document.getElementById('notebook-toc');");
  astroParts.push("        const content = document.querySelector('.notebook-embed');");
  astroParts.push('        if (!container || !content) return;');
  astroParts.push("        const nodes = Array.from(content.querySelectorAll('h1, h2, h3')); ");
  astroParts.push('        container.innerHTML = \"\";');
  astroParts.push('        if (nodes.length === 0) {');
  astroParts.push("          container.innerHTML = '<li class=\"text-sm text-muted-foreground\">(No sections)</li>';");
  astroParts.push('          return;');
  astroParts.push('        }');
  astroParts.push('        nodes.forEach((node) => {');
  astroParts.push("          let id = node.id || slugify(node.textContent || 'heading');");
  astroParts.push('          if (!node.id) node.id = id;');
  astroParts.push('          const li = document.createElement("li");');
  astroParts.push("          if (node.tagName.toLowerCase() === 'h3') li.className = 'pl-3';");
  astroParts.push('          const a = document.createElement("a");');
  astroParts.push('          a.href = `#${id}`;');
  astroParts.push("          a.className = 'block text-sm md:text-base rounded-lg px-3 py-2 transition-all duration-150 text-muted-foreground hover:text-foreground hover:bg-muted/5';");
  astroParts.push('          a.textContent = node.textContent || id;');
  astroParts.push('          li.appendChild(a);');
  astroParts.push('          container.appendChild(li);');
  astroParts.push('        });');
  astroParts.push('      };');
  astroParts.push('');
  astroParts.push('      const updateActiveToc = () => {');
  astroParts.push("        const links = Array.from(document.querySelectorAll('#notebook-toc a')); ");
  astroParts.push('        const headings = links.map((l) => document.getElementById(l.getAttribute("href").slice(1))).filter(Boolean);');
  astroParts.push('        if (headings.length === 0) return;');
  astroParts.push('        let active = links[0];');
  astroParts.push('        for (let i = 0; i < headings.length; i++) {');
  astroParts.push('          const rect = headings[i].getBoundingClientRect();');
  astroParts.push('          if (rect.top < window.innerHeight / 3) active = links[i];');
  astroParts.push('        }');
  astroParts.push("        links.forEach((l) => l.classList.remove('bg-sidebar-primary/10', 'text-sidebar-primary', 'font-semibold')); ");
  astroParts.push("        if (active) active.classList.add('bg-sidebar-primary/10', 'text-sidebar-primary', 'font-semibold');");
  astroParts.push('      };');
  astroParts.push('');
  astroParts.push('      const updateProgress = () => {');
  astroParts.push("        const bar = document.getElementById('notebook-progress-bar');");
  astroParts.push('        const docHeight = document.documentElement.scrollHeight - window.innerHeight;');
  astroParts.push('        const scrollTop = window.scrollY;');
  astroParts.push('        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;');
  astroParts.push('        if (bar) bar.style.width = pct + "%";');
  astroParts.push('      };');
  astroParts.push('');
  astroParts.push("      window.addEventListener('load', () => { buildToc(); updateActiveToc(); updateProgress(); });");
  astroParts.push("      window.addEventListener('scroll', () => { updateActiveToc(); updateProgress(); });");
  astroParts.push('      const observer = new MutationObserver(() => buildToc());');
  astroParts.push("      const embed = document.querySelector('.notebook-embed');");
  astroParts.push('      if (embed) observer.observe(embed, { childList: true, subtree: true });');
  astroParts.push('    </script>');
  astroParts.push('  </div>');
  astroParts.push('</DefaultLayout>');

  const astro = astroParts.join('\n');
  const base = path.basename(input, '.html');
  const outPath = path.join(outDir, base + '.astro');
  fs.writeFileSync(outPath, astro, 'utf8');
  console.log('Wrote', outPath);
}

console.log('Done.');


