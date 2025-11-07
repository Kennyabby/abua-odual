import { neon } from '@neondatabase/serverless';

export default async function handler(_req: any, res: any) {
  try {
    const url = process.env.DATABASE_URL;
    const hasUrl = Boolean(url);
    console.log('[db-check] invoked, has DATABASE_URL:', hasUrl);
    if (!url) {
      return res.status(500).json({ ok: false, error: 'DATABASE_URL missing' });
    }

    // Neon requires sslmode=require in most setups
    const sql = neon(url);
    console.log('[db-check] running test query');
    const rows = await sql`select now() as now`;
    console.log('[db-check] query ok', rows);

    return res.status(200).json({ ok: true, result: rows });
  } catch (err: any) {
    console.error('[db-check] error', err?.stack || err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || 'db_error' });
  }
}
