export const prerender = true;

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Exiting Preview...</title>
  <script>
    document.cookie = 'ks-branch=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'ks-draft=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.replace('/');
  </script>
</head>
<body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #09090b; color: #a1a1aa;">
  <p>Exiting preview...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
