export const prerender = true;

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Connecting to Live Preview...</title>
  <script>
    try {
      const params = new URLSearchParams(window.location.search);
      const branch = params.get('branch') || 'master';
      const to = params.get('to') || '/blog';
      document.cookie = 'ks-branch=' + encodeURIComponent(branch) + '; path=/; max-age=86400';
      document.cookie = 'ks-draft=true; path=/; max-age=86400';
      window.location.replace('/preview/?branch=' + encodeURIComponent(branch) + '&to=' + encodeURIComponent(to));
    } catch (e) {
      window.location.replace('/preview/');
    }
  </script>
</head>
<body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #09090b; color: #a1a1aa; text-align: center;">
  <div>
    <div style="width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #22c55e; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
    <p style="font-size: 14px; font-weight: 600; color: #fafafa;">Connecting to Live Preview...</p>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
