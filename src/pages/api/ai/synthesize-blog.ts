export const prerender = false;
import type { APIRoute } from 'astro';
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
}

/**
 * Clean HTML into clean Markdown/text representation for LLM context
 */
function extractReadableContent(html: string): string {
  // Strip head, scripts, styles, svg
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '');

  // Convert headings and paragraphs to basic markdown
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

  // Return at most 5,000 characters per URL to preserve token budget
  return text.slice(0, 5000);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: SynthesisRequest = await request.json().catch(() => ({}));
    const settings = await getAiBlogGeneratorSettings();

    const targetUrls = (body.urls && body.urls.length > 0)
      ? body.urls
      : settings.sourceUrls;

    if (!targetUrls || targetUrls.length === 0) {
      return new Response(JSON.stringify({
        error: 'No source URLs provided. Please configure source URLs in Keystatic or supply them in the request body.',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const topic = body.topic || settings.targetTopic || 'machine-learning';
    const tone = body.tone || settings.writingTone || 'engineer';
    const chosenModel = body.model || settings.modelPreference || DEFAULT_CF_MODEL;
    const directives = body.customInstructions || settings.additionalDirectives || '';

    // 1. Fetch and clean content from all URLs in parallel
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
        error: 'Failed to extract readable content from any of the provided URLs.',
        details: fetchedSources,
      }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Formulate Prompt
    const sourcesSummary = validExcerpts
      .map((s, idx) => `--- SOURCE [${idx + 1}]: ${s.url} ---\n${s.excerpt}`)
      .join('\n\n');

    const systemPrompt = `You are a Principal AI & Software Architect writing an original, authoritative technical article for EncodeEdge (encodeedge.com).
The article must read as an authentic, human-written guide based on deep engineering intuition, practical code benchmarks, and architectural clarity.

CRITICAL INSTRUCTIONS:
1. DO NOT summarize or plagiarize the source materials. Use them strictly as raw reference data, cross-verifying concepts and extracting core mechanics.
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

    // 3. Dispatch to AI Model (Cloudflare Workers AI or Gemini)
    let aiResponseText = '';

    const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.PUBLIC_GEMINI_API_KEY;

    if (chosenModel.startsWith('@cf/') && cfAccountId && cfApiToken) {
      // Use Cloudflare Workers AI REST API
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
      // Fallback or explicit choice: Google Gemini API (Generous Free Tier)
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\n\n${userMessage}` },
              ],
            },
          ],
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
        hint: 'In Cloudflare Pages dashboard -> Settings -> Environment Variables, add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN.',
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
        error: 'AI generated invalid JSON structure. Raw response below.',
        raw: aiResponseText,
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Generate formatted MDX document
    const today = new Date().toISOString().split('T')[0];
    const slug = articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const yamlFrontmatter = [
      '---',
      `title: ${JSON.stringify(articleData.title)}`,
      `description: ${JSON.stringify(articleData.description || '')}`,
      `pubDate: ${today}`,
      `updatedDate: ${today}`,
      `readTime: ${articleData.readTime || 12}`,
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

    return new Response(JSON.stringify({
      success: true,
      slug,
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
