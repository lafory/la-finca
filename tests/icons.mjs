// Genera los iconos PNG de la PWA a partir de public/favicon.svg
import { chromium } from 'playwright';
import fs from 'node:fs';
const svg = fs.readFileSync(new globalThis.URL('../public/favicon.svg', import.meta.url), 'utf8');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const n of [180, 192, 512]) {
  const p = await b.newPage({ viewport: { width: n, height: n } });
  await p.setContent(`<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${n}" height="${n}" `)}</body></html>`);
  await p.screenshot({ path: new globalThis.URL(`../public/icon-${n}.png`, import.meta.url).pathname });
  await p.close();
}
await b.close();
