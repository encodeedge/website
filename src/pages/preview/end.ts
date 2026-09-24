import type { APIRoute } from 'astro';

export const prerender = false;

export const ALL: APIRoute = async ({ cookies, redirect, request }) => {
  cookies.delete('ks-branch', { path: '/' });
  cookies.delete('ks-draft', { path: '/' });

  const referer = request.headers.get('Referer') || '/';
  const cleanReferer = referer.replace(/\/preview\//, '/');
  return redirect(cleanReferer, 307);
};

