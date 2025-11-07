export default async function handler(req: any, res: any) {
  const mod: any = await import('./index.js');
  return mod.default(req, res);
}
