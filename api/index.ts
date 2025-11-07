
let cachedHandler: any;
console.log('[api] module loaded');
try {
  const hasDb = Boolean(process.env.DATABASE_URL);
  console.log('[api] env DATABASE_URL present:', hasDb);
} catch {}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedHandler) {
      console.log('[api] cold start');
      console.log('[api] NODE_ENV=', process.env.NODE_ENV, ' cwd=', process.cwd());
      const target = './_app.js' as string;
      console.log('[api] importing', target);
      const mod = await import(target as any);
      if (!mod || typeof mod.initApp !== 'function') {
        console.error('[api] module missing initApp export');
        return res.status(500).json({ ok: false, error: 'initApp not found' });
      }
      console.log('[api] calling initApp');
      const app = await mod.initApp();
      console.log('[api] initApp completed');
      cachedHandler = app; // Use Express app directly on Vercel
      console.log('[api] handler cached');
    }
    try {
      const originalUrl = String(req.url || '');
      const q = (req.query || {}) as any;
      const pathParam = typeof q.path === 'string' ? q.path : undefined;
      console.log('[api] incoming url:', originalUrl, ' pathParam=', pathParam);
      if (pathParam) {
        const normalized = String(pathParam).replace(/^\/+/, '');
        req.url = '/api/' + normalized;
        if (req.originalUrl) req.originalUrl = req.url;
        console.log('[api] rewrote url from query path to', req.url);
      } else if (originalUrl && !originalUrl.startsWith('/api')) {
        req.url = '/api' + (originalUrl.startsWith('/') ? originalUrl : '/' + originalUrl);
        if (req.originalUrl) req.originalUrl = req.url;
        console.log('[api] prefixed url to', req.url);
      }
    } catch {}

    // Invoke Express app directly
    return cachedHandler(req as any, res as any);
  } catch (err: any) {
    console.error('[api] startup error', err?.stack || err?.message || err);
    try { return res.status(500).json({ ok: false, error: 'startup_failed' }); } catch {}
    throw err;
  }
}
