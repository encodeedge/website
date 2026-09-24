import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const branch = url.searchParams.get('branch');
  const to = url.searchParams.get('to') || '/blog';

  if (!branch) {
    return new Response('Missing branch query parameter', { status: 400 });
  }

  // Set cookie for draft mode session
  cookies.set('ks-branch', branch, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  cookies.set('ks-draft', 'true', {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });

  // Redirect to preview-aware path
  const targetPath = to.startsWith('/preview') ? to : `/preview${to}`;
  return redirect(`${targetPath}?branch=${encodeURIComponent(branch)}`, 307);
};

