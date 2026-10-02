export const prerender = false;
import type { APIRoute } from 'astro';

// Cloudflare Workers AI free tier default model (10,000 free daily neurons)
const DEFAULT_CF_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

interface SynthesisRequest {
  urls?: string[];
  topic?: string;
  tone?: 'engineer' | 'tutorial' | 'architecture';
  model?: string;
  customInstructions?: string;
  targetBranch?: string;
  autoSave?: boolean;
}

/**
 * Clean HTML into clean Markdown/text representation for LLM context
 */
function extractReadableContent(html: string): string {
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '');

  text = text
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n### $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '\n- $1')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '\n```\n$1\n```\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  return text.slice(0, 5000);
}

/**
 * Save draft directly to GitHub branch if token is provided, without touching main
 */
async function commitDraftToGitHubBranch(options: {
  repo: string;
  token: string;
  branch: string;
  filePath: string;
  content: string;
  commitMessage: string;
}): Promise<{ success: boolean; error?: string; branchCreated?: boolean }> {
  const { repo, token, branch, filePath, content, commitMessage } = options;
  const baseUrl = `https://api.github.com/repos/${repo}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'EncodeEdge-Synthesizer',
  };

  try {
    // 1. Check if the branch exists
    const refRes = await fetch(`${baseUrl}/git/ref/heads/${branch}`, { headers });
    let sha = '';

    if (!refRes.ok) {
      // Branch doesn't exist, create it from default branch (main/master)
      const repoRes = await fetch(baseUrl, { headers });
      if (!repoRes.ok) throw new Error(`Could not access repository: HTTP ${repoRes.status}`);
      const repoData: any = await repoRes.json();
      const defaultBranch = repoData.default_branch || 'main';

      const baseRefRes = await fetch(`${baseUrl}/git/ref/heads/${defaultBranch}`, { headers });
      if (!baseRefRes.ok) throw new Error(`Could not get base ref for branch ${defaultBranch}`);
      const baseRefData: any = await baseRefRes.json();
      const latestCommitSha = baseRefData.object.sha;

      // Create new branch
      const createRefRes = await fetch(`${baseUrl}/git/refs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${branch}`,
          sha: latestCommitSha,
        }),
      });

      if (!createRefRes.ok) {
        const createErr = await createRefRes.text();
        throw new Error(`Failed to create branch ${branch}: ${createErr}`);
      }
    }

    // 2. Check if file already exists on this branch to retrieve SHA
    const fileRes = await fetch(`${baseUrl}/contents/${filePath}?ref=${branch}`, { headers });
    if (fileRes.ok) {
      const fileData: any = await fileRes.json();
      sha = fileData.sha;
    }

    // 3. Put file content (Base64 encoded)
    const base64Content = typeof btoa === 'function' 
      ? btoa(unescape(encodeURIComponent(content)))
      : Buffer.from(content).toString('base64');

    const putRes = await fetch(`${baseUrl}/contents/${filePath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const putErr = await putRes.text();
      throw new Error(`Failed to commit file to ${branch}: ${putErr}`);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

interface ExtractedArticle {
  title: string;
  slug?: string;
  description: string;
  readTime?: number;
  topics?: string[];
  tags?: string[];
  authorName?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  faqs?: Array<{ question: string; answer: string; category?: string }>;
  references?: Array<{ title: string; url: string; type?: string }>;
  mdxContent: string;
}

function sanitizeParsedArticle(data: any, defaultTopic: string): ExtractedArticle {
  return {
    title: String(data.title || 'Comprehensive Guide to ' + defaultTopic).trim(),
    slug: data.slug ? String(data.slug).trim() : undefined,
    description: String(data.description || '').trim(),
    readTime: Number(data.readTime) || 12,
    topics: Array.isArray(data.topics) && data.topics.length ? data.topics.map(String) : [defaultTopic],
    tags: Array.isArray(data.tags) && data.tags.length ? data.tags.map(String) : ['machine-learning', 'guide'],
    authorName: data.authorName ? String(data.authorName).trim() : 'Atul Jha',
    seoTitle: data.seoTitle ? String(data.seoTitle).trim() : undefined,
    seoDescription: data.seoDescription ? String(data.seoDescription).trim() : undefined,
    canonicalUrl: data.canonicalUrl ? String(data.canonicalUrl).trim() : undefined,
    faqs: Array.isArray(data.faqs)
      ? data.faqs.map((f: any) => ({
          question: String(f.question || '').trim(),
          answer: String(f.answer || '').trim(),
          category: f.category ? String(f.category).trim() : undefined,
        })).filter((f: any) => f.question && f.answer)
      : [],
    references: Array.isArray(data.references)
      ? data.references.map((r: any) => ({
          title: String(r.title || '').trim(),
          url: String(r.url || '').trim(),
          type: r.type ? String(r.type).trim() : undefined,
        })).filter((r: any) => r.title && r.url)
      : [],
    mdxContent: String(data.mdxContent || '').trim(),
  };
}

function parseOrRecoverArticle(rawText: string, defaultTopic: string): ExtractedArticle {
  let candidate = rawText.trim();

  // 1. Check if enclosed in markdown code fences ```json ... ``` or ``` ... ```
  const codeBlockMatch = candidate.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1].includes('{')) {
    candidate = codeBlockMatch[1].trim();
  } else {
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      candidate = candidate.substring(firstBrace, lastBrace + 1).trim();
    }
  }

  // 2. Direct JSON.parse
  try {
    const parsed = JSON.parse(candidate);
    if (parsed && typeof parsed === 'object') {
      return sanitizeParsedArticle(parsed, defaultTopic);
    }
  } catch {
    // Continue
  }

  // 3. Sanitized JSON.parse (fix unescaped LaTeX backslashes & control characters)
  try {
    let sanitized = candidate
      .replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1')
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, ' ');

    if (!sanitized.endsWith('}')) {
      const openQuotes = (sanitized.match(/"/g) || []).length % 2 !== 0;
      if (openQuotes) sanitized += '"';
      if (!sanitized.endsWith('}')) sanitized += '\n}';
    }

    const parsed = JSON.parse(sanitized);
    if (parsed && typeof parsed === 'object') {
      return sanitizeParsedArticle(parsed, defaultTopic);
    }
  } catch {
    // Continue to regex field extractor
  }

  // 4. Regex-based field extraction (impervious to JSON syntax breaks inside markdown or code)
  console.log('[AI Synthesizer] Standard JSON parse failed; running regex-based field extraction');

  const extractString = (key: string): string => {
    const regex = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'i');
    const match = candidate.match(regex);
    if (match && match[1]) {
      return match[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\');
    }
    return '';
  };

  const title =
    extractString('title') ||
    candidate.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    `Production Guide to ${defaultTopic.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`;

  const slug =
    extractString('slug') ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const description =
    extractString('description') ||
    `An in-depth, production-ready engineering guide exploring ${title}.`;

  const seoTitle = extractString('seoTitle') || `${title} | EncodeEdge`;
  const seoDescription = extractString('seoDescription') || description.slice(0, 155);

  let readTime = 14;
  const readTimeMatch = candidate.match(/"readTime"\s*:\s*(\d+)/);
  if (readTimeMatch) readTime = parseInt(readTimeMatch[1], 10);

  // Extract tags array
  let tags: string[] = ['machine-learning', 'guide'];
  const tagsMatch = candidate.match(/"tags"\s*:\s*\[([\s\S]*?)\]/);
  if (tagsMatch) {
    try {
      tags = JSON.parse(`[${tagsMatch[1]}]`);
    } catch {
      tags = tagsMatch[1]
        .split(',')
        .map((t) => t.replace(/["'\s]/g, ''))
        .filter(Boolean);
    }
  }

  // Extract FAQs
  let faqs: Array<{ question: string; answer: string; category?: string }> = [];
  const faqsMatch = candidate.match(/"faqs"\s*:\s*(\[\s*\{[\s\S]*?\}\s*\])/);
  if (faqsMatch) {
    try {
      faqs = JSON.parse(faqsMatch[1]);
    } catch {}
  }

  // Extract References
  let references: Array<{ title: string; url: string; type?: string }> = [];
  const refMatch = candidate.match(/"references"\s*:\s*(\[\s*\{[\s\S]*?\}\s*\])/);
  if (refMatch) {
    try {
      references = JSON.parse(refMatch[1]);
    } catch {}
  }

  // Extract mdxContent
  let mdxContent = '';
  const mdxMatch = candidate.match(/"mdxContent"\s*:\s*"([\s\S]*)/);
  if (mdxMatch && mdxMatch[1]) {
    const rawMdx = mdxMatch[1].replace(/"\s*\}?\s*$/g, '');
    mdxContent = rawMdx
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  }

  // If mdxContent is still empty, the model likely output direct Markdown
  if (!mdxContent || mdxContent.trim().length < 50) {
    const strippedCandidate = rawText
      .replace(/```(?:json)?[\s\S]*?```/i, '')
      .trim();
    mdxContent = strippedCandidate.length > 50 ? strippedCandidate : rawText;
  }

  return {
    title,
    slug,
    description,
    readTime,
    topics: [defaultTopic],
    tags: tags.length ? tags : ['machine-learning', 'guide'],
    seoTitle,
    seoDescription,
    faqs,
    references,
    mdxContent,
  };
}

export const POST: APIRoute = async (context) => {
  console.log('[AI Synthesizer] Incoming synthesis request received');
  try {
    const { request, locals } = context;
    const cfEnv = (locals as any)?.runtime?.env || {};

    // 1. Parse JSON body
    const body: SynthesisRequest = await request.json().catch(() => ({}));
    console.log('[AI Synthesizer] Request body parsed:', {
      urlsCount: body.urls?.length,
      topic: body.topic,
      tone: body.tone,
      model: body.model,
      branch: body.targetBranch,
    });

    // 2. Verify GitHub Authentication (Keystatic cookie or server token)
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    const userGhToken = cookies['keystatic-gh-access-token'] || request.headers.get('authorization')?.replace('Bearer ', '');
    const isDev = process.env.NODE_ENV === 'development' || !process.env.DEPLOY_TARGET;

    if (!isDev && !userGhToken && !process.env.GITHUB_TOKEN && !cfEnv.GITHUB_TOKEN) {
      console.warn('[AI Synthesizer] Authentication check failed - no keystatic-gh-access-token cookie found');
      return new Response(JSON.stringify({
        error: 'Unauthorized: GitHub authentication required. Please sign into Keystatic via GitHub to use the AI Generator.',
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targetUrls = (body.urls && body.urls.length > 0) ? body.urls : [];

    if (targetUrls.length === 0) {
      return new Response(JSON.stringify({
        error: 'No source URLs provided. Please enter at least one URL to analyze.',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const topic = body.topic || 'machine-learning';
    const tone = body.tone || 'engineer';
    const chosenModel = body.model || DEFAULT_CF_MODEL;
    const directives = body.customInstructions || '';
    const targetBranch = (body.targetBranch && body.targetBranch.trim()) ? body.targetBranch.trim() : 'master';
    const shouldAutoSave = body.autoSave !== undefined ? body.autoSave : true;

    // 3. Fetch content from URLs with universal AbortController
    const fetchedSources: { url: string; excerpt: string; error?: string }[] = [];

    await Promise.all(
      targetUrls.map(async (rawUrl) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
          const validUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
          console.log(`[AI Synthesizer] Fetching source: ${validUrl}`);
          const res = await fetch(validUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            signal: controller.signal,
          });

          if (!res.ok) {
            console.warn(`[AI Synthesizer] Source ${validUrl} returned HTTP ${res.status}`);
            fetchedSources.push({ url: validUrl, excerpt: '', error: `HTTP ${res.status}` });
            return;
          }

          const html = await res.text();
          const cleanText = extractReadableContent(html);
          fetchedSources.push({ url: validUrl, excerpt: cleanText });
        } catch (err: any) {
          console.warn(`[AI Synthesizer] Source fetch failed: ${err.message}`);
          fetchedSources.push({ url: rawUrl, excerpt: '', error: err.message || 'Fetch failed' });
        } finally {
          clearTimeout(timeoutId);
        }
      })
    );

    let validExcerpts = fetchedSources.filter((s) => s.excerpt && !s.error);

    // Fallback: If target website blocks automated crawlers (e.g. Cloudflare Turnstile 403),
    // derive topic cues from URL slugs so generation continues seamlessly without failing
    if (validExcerpts.length === 0) {
      console.log('[AI Synthesizer] All URLs guarded by anti-bot; activating topic cues fallback');
      const fallbackTopics = targetUrls.map((u) => {
        try {
          const parsed = new URL(u.startsWith('http') ? u : `https://${u}`);
          const slugPart = parsed.pathname.split('/').filter(Boolean).pop() || parsed.pathname;
          return slugPart.replace(/[-_]+/g, ' ').replace(/\.[a-z]+$/i, '').trim();
        } catch {
          return u;
        }
      });

      validExcerpts = targetUrls.map((u, idx) => ({
        url: u,
        excerpt: `[Source Reference: ${u} - Topic: "${fallbackTopics[idx] || topic}"] Anti-bot protection guarded direct HTML. Focus directly on this exact topic and core production engineering best practices.`
      }));
    }

    // 4. Prepare Prompt
    const sourcesSummary = validExcerpts
      .map((s, idx) => `--- SOURCE [${idx + 1}]: ${s.url} ---\n${s.excerpt}`)
      .join('\n\n');

    const systemPrompt = `You are a Principal AI & Software Architect writing an original, authoritative technical article for EncodeEdge (encodeedge.com).
The article must read as an authentic, human-written guide based on deep engineering intuition, practical code benchmarks, and architectural clarity.

CRITICAL INSTRUCTIONS:
1. DO NOT summarize or copy the source materials. Use them strictly as raw reference data, cross-verifying concepts and extracting core mechanics.
2. Tone: ${
      tone === 'engineer'
        ? 'Senior Staff Engineer (rigorous, zero-fluff, code-first, explaining memory, performance, and internal mechanics).'
        : tone === 'tutorial'
        ? 'Pragmatic Engineering Tutorial (clear step-by-step progression with visual mental models, pitfalls, and concrete code).'
        : 'System Architecture Deep Dive (system design, throughput tradeoffs, data pipelines, scaling limits).'
    }
3. Length & Depth Requirement:
   - The "mdxContent" MUST be an exhaustive, long-form technical article (minimum 1,500 to 2,500 words).
   - NEVER provide a brief summary, outline, or truncate after a single introductory section.
   - Flesh out EVERY concept with concrete engineering rationale, mathematical intuitions, and real-world edge cases.

4. Mandatory Article Structure:
   - ## 1. Problem Formulation & Production Bottlenecks (Data leakage, concept drift, distribution shift).
   - ## 2. Core Mental Model & Data Architecture (Clear ASCII or Mermaid diagram of data transformations).
   - ## 3. Phase 1: Strategic Data Selection & Sampling (Stratified splits, temporal boundaries, class imbalance).
   - ## 4. Phase 2: Systematic Preprocessing & Imputation (Iterative/KNN imputation, robust outlier pruning).
   - ## 5. Phase 3: Feature Transformation & Scaling (StandardScaler vs RobustScaler vs Quantile, cyclical encodings).
   - ## 6. Production-Ready Python Pipeline (Full runnable Scikit-Learn ColumnTransformer / Pipeline script with error handling and typing).
   - ## 7. Memory & Performance Benchmarks (Reducing DataFrame memory footprints, Polars vs Pandas).
   - ## 8. Architectural Tradeoffs & Decision Matrix (Markdown comparison table).
   - ## 9. Production Readiness Checklist.

5. Output format: Return STRICTLY a valid JSON object matching this schema:
{
  "title": "Clear, compelling, high-CTR technical title",
  "slug": "kebab-case-slug",
  "description": "Engaging 1-2 sentence description for search and card previews",
  "readTime": 15,
  "topics": ["${topic}"],
  "tags": ["relevant", "technical", "tags"],
  "seoTitle": "Search-optimized title under 60 chars | EncodeEdge",
  "seoDescription": "High-CTR search meta description with primary keywords (under 155 chars).",
  "canonicalUrl": "",
  "faqs": [
    {"question": "Key question 1", "answer": "Clear practical answer", "category": "General"},
    {"question": "Key question 2", "answer": "Detailed answer", "category": "Advanced"}
  ],
  "references": [
    ${validExcerpts.map(s => `{"title": "Reference Guide", "url": "${s.url}", "type": "article"}`).join(', ')}
  ],
  "mdxContent": "The exhaustive, complete multi-section markdown article with deep headings (##, ###), LaTeX formulas ($...$ or $$...$$), and executable code snippets."
}

CRITICAL RULES:
- Output MUST be strictly a parseable JSON object. No conversational preamble, no closing remarks.
- Write the complete, unabridged article inside "mdxContent" from introduction through conclusion.
- Escape all internal double quotes as \\" and do not use unescaped control characters.`;

    const userMessage = `Please synthesize these reference sources into an exhaustive, comprehensive 2,000+ word engineering tutorial for the "${topic}" track.
Ensure ALL 9 sections are fully developed with complete explanations and runnable code examples. Do NOT truncate or output outlines.
Additional Author Directives: ${directives || 'None'}

REFERENCE MATERIAL:
${sourcesSummary}

Respond ONLY with the raw JSON object.`;

    // 5. Dispatch to AI Model
    let aiResponseText = '';
    const rawAccountId = cfEnv.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
    const rawApiToken = cfEnv.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
    const cfAccountId = typeof rawAccountId === 'string' ? rawAccountId.trim() : '';
    const cfApiToken = typeof rawApiToken === 'string' ? rawApiToken.trim() : '';
    const geminiApiKey = (cfEnv.GEMINI_API_KEY || process.env.GEMINI_API_KEY || cfEnv.PUBLIC_GEMINI_API_KEY || process.env.PUBLIC_GEMINI_API_KEY || '').trim();

    // Map common aliases to exact Cloudflare Workers AI model endpoints
    const MODEL_MAP: Record<string, string> = {
      '@cf/meta/llama-3.3-70b-instruct': '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      '@cf/meta/llama-3.1-70b-instruct': '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      '@cf/meta/llama-3.1-8b-instruct': '@cf/meta/llama-3.1-8b-instruct',
      '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b': '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
    };
    const modelToRun = MODEL_MAP[chosenModel] || chosenModel;

    console.log('[AI Synthesizer] AI credentials available:', {
      hasCfBinding: !!(cfEnv.AI && typeof cfEnv.AI.run === 'function'),
      hasCfAccountId: !!cfAccountId,
      hasCfToken: !!cfApiToken,
      hasGeminiKey: !!geminiApiKey,
      modelRequested: chosenModel,
      modelToRun,
    });

    // A. Check for Cloudflare Pages native Workers AI binding (env.AI)
    if (cfEnv.AI && typeof cfEnv.AI.run === 'function') {
      try {
        console.log(`[AI Synthesizer] Dispatching via native Cloudflare env.AI binding to ${modelToRun}`);
        const cfResult = await cfEnv.AI.run(modelToRun, {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 4096,
        });
        aiResponseText = cfResult?.response || cfResult?.text || '';
      } catch (bindingErr: any) {
        console.warn(`[AI Synthesizer] env.AI binding error: ${bindingErr.message}`);
      }
    }

    // B. Check for Cloudflare Workers AI REST API
    if (!aiResponseText && modelToRun.startsWith('@cf/') && cfAccountId && cfApiToken) {
      console.log(`[AI Synthesizer] Dispatching via Cloudflare REST API to ${modelToRun}`);
      const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/${modelToRun}`;
      const cfRes = await fetch(cfUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cfApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 4096,
          temperature: 0.3,
        }),
      });

      if (!cfRes.ok) {
        const errorText = await cfRes.text();
        console.error(`[AI Synthesizer] Workers AI HTTP ${cfRes.status}:`, errorText);
        return new Response(JSON.stringify({
          error: `Cloudflare Workers AI returned HTTP ${cfRes.status}: ${errorText}`,
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const cfData: any = await cfRes.json();
      aiResponseText = cfData.result?.response || cfData.result?.text || '';
    }

    // C. Check for Google Gemini API fallback
    if (!aiResponseText && geminiApiKey) {
      console.log('[AI Synthesizer] Dispatching via Google Gemini API');
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        console.error(`[AI Synthesizer] Gemini HTTP ${geminiRes.status}:`, errorText);
        return new Response(JSON.stringify({
          error: `Gemini API returned HTTP ${geminiRes.status}: ${errorText}`,
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const geminiData: any = await geminiRes.json();
      aiResponseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // D. If no AI credentials found
    if (!aiResponseText) {
      console.warn('[AI Synthesizer] No AI credentials configured in Cloudflare Pages');
      return new Response(JSON.stringify({
        error: 'No AI credentials found. To use Cloudflare Workers AI for free, set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in your Cloudflare Pages dashboard (Settings -> Environment Variables). Alternatively, set GEMINI_API_KEY.',
        hint: 'In Cloudflare Pages -> Settings -> Environment Variables, add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN.',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 6. Parse / Recover Article from AI Model Response
    console.log('[AI Synthesizer] Parsing & recovering article from model response');
    const articleData = parseOrRecoverArticle(aiResponseText, topic);

    // 7. Generate formatted MDX document with draft: true
    const today = new Date().toISOString().split('T')[0];
    const slug = articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const yamlFrontmatter = [
      '---',
      `title: "${String(articleData.title).replace(/"/g, '\\"')}"`,
      `description: "${String(articleData.description).replace(/"/g, '\\"')}"`,
      `pubDate: ${today}`,
      `updatedDate: ${today}`,
      `readTime: ${articleData.readTime || 12}`,
      `draft: true`,
      `featured: false`,
      `tags:`,
      ...(articleData.tags || ['machine-learning', 'guide']).map((t: string) => `  - ${t}`),
      `topics:`,
      `  - ${topic}`,
      `authorName: "${articleData.authorName || 'Atul Jha'}"`,
      `seoTitle: "${String(articleData.seoTitle || articleData.title).replace(/"/g, '\\"')}"`,
      `seoDescription: "${String(articleData.seoDescription || articleData.description).replace(/"/g, '\\"')}"`,
      articleData.canonicalUrl ? `canonicalUrl: "${articleData.canonicalUrl}"` : null,
      articleData.faqs && articleData.faqs.length > 0 ? 'faqs:' : null,
      ...(articleData.faqs || []).flatMap((faq: any) => [
        `  - question: "${String(faq.question).replace(/"/g, '\\"')}"`,
        `    answer: "${String(faq.answer).replace(/"/g, '\\"')}"`,
        faq.category ? `    category: "${String(faq.category).replace(/"/g, '\\"')}"` : null,
      ]).filter(Boolean),
      articleData.references && articleData.references.length > 0 ? 'references:' : null,
      ...(articleData.references || []).flatMap((ref: any) => [
        `  - title: "${String(ref.title).replace(/"/g, '\\"')}"`,
        `    url: "${ref.url}"`,
        ref.type ? `    type: "${ref.type}"` : null,
      ]).filter(Boolean),
      '---',
      '',
      articleData.mdxContent || '',
    ].filter((line) => line !== null).join('\n');

    let saveStatus = 'generated draft in memory';
    let savedLocation = '';

    // 8. Save article (to private GitHub branch or in-memory)
    if (shouldAutoSave) {
      const githubToken = process.env.GITHUB_TOKEN || cfEnv.GITHUB_TOKEN || process.env.KEYSTATIC_GITHUB_TOKEN || cfEnv.KEYSTATIC_GITHUB_TOKEN || userGhToken;
      const githubRepo = process.env.GITHUB_REPO || cfEnv.GITHUB_REPO || 'encodeedge/website';

      if (githubToken && targetBranch) {
        console.log(`[AI Synthesizer] Committing draft to GitHub branch "${targetBranch}"`);
        const commitRes = await commitDraftToGitHubBranch({
          repo: githubRepo,
          token: githubToken,
          branch: targetBranch,
          filePath: `src/content/blog/${slug}.mdx`,
          content: yamlFrontmatter,
          commitMessage: `draft(blog): create AI-synthesized draft for ${articleData.title} [draft: true]`,
        });

        if (commitRes.success) {
          saveStatus = `committed to private branch "${targetBranch}"`;
          savedLocation = `https://github.com/${githubRepo}/blob/${targetBranch}/src/content/blog/${slug}.mdx`;
          console.log(`[AI Synthesizer] Successfully committed to ${savedLocation}`);
        } else {
          saveStatus = `github commit failed (${commitRes.error}), saved in memory`;
          console.warn(`[AI Synthesizer] GitHub commit failed: ${commitRes.error}`);
        }
      }
    }

    console.log('[AI Synthesizer] Completed successfully! Returning 200 with slug:', slug);
    return new Response(JSON.stringify({
      success: true,
      slug,
      draft: true,
      saveStatus,
      savedLocation,
      targetBranch,
      article: articleData,
      formattedMdx: yamlFrontmatter,
      sourcesConsulted: validExcerpts.map(s => s.url),
      modelUsed: chosenModel,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[AI Synthesizer Fatal Handler Exception]:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error during article synthesis',
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
