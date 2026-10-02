export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { getAiBlogGeneratorSettings } from '@/lib/settings';

// Cloudflare Workers AI supports 10,000 free neurons daily on all Cloudflare accounts.
// Endpoint: https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}
const DEFAULT_CF_MODEL = '@cf/meta/llama-3.3-70b-instruct';

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
    let refRes = await fetch(`${baseUrl}/git/ref/heads/${branch}`, { headers });
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
    const base64Content = Buffer.from(content).toString('base64');
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

export const POST: APIRoute = async ({ request }) => {
  try {
    // 0. Verify GitHub Authentication (Keystatic cookie or Bearer token)
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    const userGhToken = cookies['keystatic-gh-access-token'] || request.headers.get('authorization')?.replace('Bearer ', '');
    const isDev = process.env.NODE_ENV === 'development' || !process.env.DEPLOY_TARGET;

    if (!isDev && !userGhToken && !process.env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({
        error: 'Unauthorized: GitHub authentication required. Please log into Keystatic with GitHub to use the AI Generator.',
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targetUrls = (body.urls && body.urls.length > 0)
      ? body.urls
      : settings.sourceUrls;

    if (!targetUrls || targetUrls.length === 0) {
      return new Response(JSON.stringify({
        error: 'No source URLs provided. Please enter URLs to analyze.',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const topic = body.topic || settings.targetTopic || 'machine-learning';
    const tone = body.tone || settings.writingTone || 'engineer';
    const chosenModel = body.model || settings.modelPreference || DEFAULT_CF_MODEL;
    const directives = body.customInstructions || settings.additionalDirectives || '';
    const targetBranch = body.targetBranch || settings.targetBranch || 'drafts/ai-articles';
    const shouldAutoSave = body.autoSave !== undefined ? body.autoSave : true;

    // 1. Fetch content from URLs
    const fetchedSources: { url: string; excerpt: string; error?: string }[] = [];

    await Promise.all(
      targetUrls.map(async (rawUrl) => {
        try {
          const validUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
          const res = await fetch(validUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; EncodeEdgeBot/1.0; +https://www.encodeedge.com)',
              'Accept': 'text/html,application/xhtml+xml,text/plain',
            },
            signal: AbortSignal.timeout(10000),
          });

          if (!res.ok) {
            fetchedSources.push({ url: validUrl, excerpt: '', error: `HTTP ${res.status}` });
            return;
          }

          const html = await res.text();
          const cleanText = extractReadableContent(html);
          fetchedSources.push({ url: validUrl, excerpt: cleanText });
        } catch (err: any) {
          fetchedSources.push({ url: rawUrl, excerpt: '', error: err.message || 'Fetch failed' });
        }
      })
    );

    const validExcerpts = fetchedSources.filter((s) => s.excerpt && !s.error);
    if (validExcerpts.length === 0) {
      return new Response(JSON.stringify({
        error: 'Could not extract readable content from any of the provided URLs.',
        details: fetchedSources,
      }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Prepare Prompt
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
        : tone === 'architecture'
        ? 'System Architect (analyzing trade-offs, scalability, architectural patterns, and production pitfalls).'
        : 'Hands-on Mentor (approachable, step-by-step, intuitive analogies, practical exercises).'
    }
3. Author: "Atul Jha".
4. Output MUST be a valid JSON object matching the schema below. No markdown fences outside the JSON.

SCHEMA REQUIRED:
{
  "title": "Compelling, engineering-focused title",
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
    ${validExcerpts.map(s => `{"title": "Source Reference", "url": "${s.url}", "type": "article"}`).join(', ')}
  ],
  "mdxContent": "The complete, manual-quality markdown article with deep headings (##, ###), LaTeX formulas ($...$ or $$...$$), and executable code snippets."
}`;

    const userMessage = `Please review and synthesize these reference sources into a comprehensive, original tutorial for the "${topic}" track.
Additional Author Directives: ${directives || 'None'}

REFERENCE MATERIAL:
${sourcesSummary}

Respond ONLY with the raw JSON object.`;

    // 3. Dispatch to AI Model
    let aiResponseText = '';
    const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.PUBLIC_GEMINI_API_KEY;

    if (chosenModel.startsWith('@cf/') && cfAccountId && cfApiToken) {
      const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/${chosenModel}`;
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
        throw new Error(`Workers AI returned HTTP ${cfRes.status}: ${errorText}`);
      }

      const cfData: any = await cfRes.json();
      aiResponseText = cfData.result?.response || cfData.result?.text || '';
    } else if (geminiApiKey) {
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
        throw new Error(`Gemini API returned HTTP ${geminiRes.status}: ${errorText}`);
      }

      const geminiData: any = await geminiRes.json();
      aiResponseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      return new Response(JSON.stringify({
        error: 'No AI credentials found. To use Cloudflare Workers AI for free, set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in your environment or Cloudflare Pages settings. Alternatively, set GEMINI_API_KEY.',
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Parse JSON Response
    let articleData: any = null;
    try {
      const cleanedJsonStr = aiResponseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      articleData = JSON.parse(cleanedJsonStr);
    } catch {
      return new Response(JSON.stringify({
        error: 'AI generated invalid JSON structure.',
        raw: aiResponseText,
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Generate formatted MDX document with draft: true
    const today = new Date().toISOString().split('T')[0];
    const slug = articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const yamlFrontmatter = [
      '---',
      `title: ${JSON.stringify(articleData.title)}`,
      `description: ${JSON.stringify(articleData.description || '')}`,
      `pubDate: ${today}`,
      `updatedDate: ${today}`,
      `readTime: ${articleData.readTime || 12}`,
      `draft: true`,
      `featured: false`,
      `tags:`,
      ...(articleData.tags || ['ai', 'tutorial']).map((t: string) => `  - ${t}`),
      `topics:`,
      ...(articleData.topics || [topic]).map((t: string) => `  - ${t}`),
      `seoTitle: ${JSON.stringify(articleData.seoTitle || '')}`,
      `seoDescription: ${JSON.stringify(articleData.seoDescription || '')}`,
      articleData.canonicalUrl ? `canonicalUrl: ${JSON.stringify(articleData.canonicalUrl)}` : null,
      `image: /assets/blog/default-post.svg`,
      `authorImage: /assets/introduction-to-machine-learning/authorImage.png`,
      `authorName: Atul Jha`,
      `faqs:`,
      ...(articleData.faqs || []).map((faq: any) => 
        `  - question: ${JSON.stringify(faq.question)}\n    answer: ${JSON.stringify(faq.answer)}\n    category: ${JSON.stringify(faq.category || 'General')}`
      ),
      `references:`,
      ...(articleData.references || []).map((ref: any) => 
        `  - title: ${JSON.stringify(ref.title || 'Reference')}\n    url: ${JSON.stringify(ref.url)}\n    type: ${JSON.stringify(ref.type || 'article')}`
      ),
      '---',
      '',
      articleData.mdxContent || '',
    ].filter((line) => line !== null).join('\n');

    let saveStatus = 'unsaved';
    let savedLocation = '';

    // 6. Save article (to private GitHub branch or local disk)
    if (shouldAutoSave) {
      const githubToken = process.env.GITHUB_TOKEN || process.env.KEYSTATIC_GITHUB_TOKEN || userGhToken;
      const githubRepo = process.env.GITHUB_REPO || 'encodeedge/website';

      if (githubToken && targetBranch) {
        // Commit directly to a private/draft branch in GitHub without touching main
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
        } else {
          saveStatus = `github commit failed (${commitRes.error}), saved to memory`;
        }
      } else {
        // Local environment or fallback: Write file to disk with draft: true
        try {
          if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
            const blogDir = path.join(process.cwd(), 'src/content/blog');
            if (fs.existsSync(blogDir)) {
              const targetFilePath = path.join(blogDir, `${slug}.mdx`);
              fs.writeFileSync(targetFilePath, yamlFrontmatter, 'utf-8');
              saveStatus = 'saved to local disk as draft';
              savedLocation = `src/content/blog/${slug}.mdx`;
            } else {
              saveStatus = 'generated draft in memory';
            }
          } else {
            saveStatus = 'generated draft in memory (Cloudflare Pages)';
          }
        } catch (fsErr: any) {
          saveStatus = `disk save skipped (${fsErr.message})`;
        }
      }
    }

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
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error during article synthesis',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
