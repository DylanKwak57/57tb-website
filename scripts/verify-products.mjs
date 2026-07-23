import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const locales = ['th', 'en', 'ko'];
const imageData = JSON.parse(readFileSync(join(root, 'src/data/products-images.json'), 'utf8'));
const source = readFileSync(join(root, 'src/data/products.ts'), 'utf8');
const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
const valentineSlugs = ['valentine-magic-straight-system', 'valentine-lpp-treatment'];

function decode(path) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', path], { encoding: 'utf8' });
  if (!/pixelWidth:\s+[1-9]/.test(output) || !/pixelHeight:\s+[1-9]/.test(output)) throw new Error(`Asset decode failed: ${path}`);
}

if (slugs.length !== 18 || new Set(slugs).size !== 18) throw new Error('Expected 18 unique catalog routes');
for (const locale of locales) for (const slug of slugs) {
  const route = join(root, 'out', locale, 'products', `${slug}.html`);
  if (!existsSync(route)) throw new Error(`Missing static route: ${locale}/${slug}`);
  const html = readFileSync(route, 'utf8');
  if (!html.includes('<html')) throw new Error(`Invalid HTML guard: ${locale}/${slug}`);
  if (valentineSlugs.includes(slug) && (html.includes('BELLISTA') || html.includes('Coming Soon'))) throw new Error(`Valentine brand guard failed: ${locale}/${slug}`);
  if (!valentineSlugs.includes(slug) && (!html.includes('← BELLISTA') && !html.includes('BELLISTA'))) throw new Error(`Legacy visible guard failed: ${locale}/${slug}`);
}
for (const [slug, entry] of Object.entries(imageData)) {
  if ('chunks' in entry) {
    for (let index = 0; index < entry.chunks; index += 1) decode(join(root, 'public/products', slug, `c${String(index).padStart(2, '0')}.webp`));
  } else {
    for (const chunk of entry.locales.th.chunks) decode(join(root, 'public/products', slug, chunk.file));
    decode(join(root, 'public/products', slug, 'thumb.webp'));
  }
}
console.log('Static verification passed: 54 routes, locale fallback, legacy and Valentine guards, image decoding.');
