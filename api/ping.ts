export default async function handler(_req: any, res: any) {
  try {
    console.log('[api] ping invoked');
    return res.status(200).json({ ok: true, ts: Date.now() });
  } catch (err: any) {
    console.error('[api] ping error', err?.stack || err?.message || err);
    return res.status(500).json({ ok: false });
  }
}
