export default async function handler(_req: any, res: any) {
  try {
    console.log('[api] healthz invoked');
    const hasDb = Boolean(process.env.DATABASE_URL);
    return res.status(200).json({ status: 'ok', dbEnvPresent: hasDb, ts: Date.now() });
  } catch (err: any) {
    console.error('[api] healthz error', err?.stack || err?.message || err);
    return res.status(500).json({ status: 'error' });
  }
}
