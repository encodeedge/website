/**
 * Normalizes a slug or title for robust comparison by stripping common course prefixes
 * and standardizing separator hyphens.
 * @param {string} str 
 */
export function normalizeSlug(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/^(dlfn|fds|pbla|dl|ds|py|ml|llm)-+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Finds the best matching lesson for any given target identifier (old slug, renamed slug, title, etc.)
 * @param {string} targetSlug 
 * @param {Array<any>} allLessons 
 */
export function findMatchingLesson(targetSlug, allLessons) {
  if (!targetSlug || !Array.isArray(allLessons) || allLessons.length === 0) return null;
  const rawTarget = String(targetSlug).toLowerCase().trim();

  // 1. Exact ID match
  const exact = allLessons.find(l => l.id.toLowerCase() === rawTarget);
  if (exact) return exact;

  // 2. Normalized slug match (without prefixes like dl-, ds-, py-, etc.)
  const normTarget = normalizeSlug(rawTarget);
  const byNorm = allLessons.find(l => normalizeSlug(l.id) === normTarget);
  if (byNorm) return byNorm;

  // 3. Match against title slugified
  const byTitle = allLessons.find(l => {
    const titleSlug = normalizeSlug(l.data?.title || '');
    return titleSlug && (titleSlug === normTarget || titleSlug === rawTarget);
  });
  if (byTitle) return byTitle;

  // 4. Token overlap match (e.g. "six-jars-framework-data-and-tasks" -> "data-and-tasks")
  const targetTokens = normTarget.split('-').filter(t => t.length > 2);
  if (targetTokens.length > 0) {
    let bestLesson = null;
    let maxOverlap = 0;
    for (const l of allLessons) {
      const lTokens = new Set(normalizeSlug(l.id).split('-').filter(t => t.length > 2));
      let overlap = 0;
      for (const t of targetTokens) {
        if (lTokens.has(t)) overlap++;
      }
      if (overlap > maxOverlap && overlap >= Math.min(2, targetTokens.length)) {
        maxOverlap = overlap;
        bestLesson = l;
      }
    }
    if (bestLesson) return bestLesson;
  }

  return null;
}
