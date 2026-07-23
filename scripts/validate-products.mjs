import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const publicProducts = join(root, 'public/products');
const metadata = JSON.parse(readFileSync(join(root, 'src/data/products-images.json'), 'utf8'));
const valentine = {
  'valentine-magic-straight-system': { files: ['hero.webp', 'thumb.webp'], width: 1500, height: 1050, total: 6_000_000 },
  'valentine-lpp-treatment': { files: ['hero.webp', 'thumb.webp'], width: 1100, height: 1100, total: 4_500_000 },
};

function dimensions(file) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const numbers = [...output.matchAll(/pixel(?:Width|Height):\s+(\d+)/g)].map((match) => Number(match[1]));
  if (numbers.length !== 2 || numbers.some((value) => value < 1)) throw new Error(`Unreadable image: ${file}`);
  return { width: numbers[0], height: numbers[1] };
}

for (const [slug, spec] of Object.entries(valentine)) {
  const base = join(publicProducts, slug);
  const actual = readdirSync(base).sort();
  const expected = [...spec.files].sort();
  if (actual.join('|') !== expected.join('|')) throw new Error(`${slug}: unexpected asset set (${actual.join(', ')})`);
  let transfer = 0;
  for (const file of spec.files) {
    const path = join(base, file);
    if (!existsSync(path)) throw new Error(`${slug}: missing ${file}`);
    const size = statSync(path).size;
    if (file === 'thumb.webp' && size > 250_000) throw new Error(`${slug}: thumbnail exceeds 250KB`);
    if (file === 'hero.webp' && size > 650_000) throw new Error(`${slug}: hero exceeds 650KB`);
    if (file !== 'thumb.webp' && size > 450_000) throw new Error(`${slug}: detail panel exceeds 450KB`);
    transfer += size;
    const decoded = dimensions(path);
    if (file === 'hero.webp' && (decoded.width !== spec.width || decoded.height !== spec.height)) throw new Error(`${slug}: hero dimensions are ${decoded.width}x${decoded.height}`);
  }
  if (transfer > spec.total) throw new Error(`${slug}: total image transfer exceeds budget`);
  const chunks = metadata[slug]?.locales?.th?.chunks;
  if (!Array.isArray(chunks) || chunks.length !== 1 || chunks[0].file !== 'hero.webp') throw new Error(`${slug}: image metadata must contain one Thai hero`);
}

const source = readFileSync(join(root, 'src/data/products.ts'), 'utf8');
const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
if (new Set(slugs).size !== slugs.length) throw new Error('Catalog has duplicate slugs');
if (slugs.length !== 18) throw new Error(`Catalog identity mismatch: expected 18 products, found ${slugs.length}`);
for (const slug of slugs.slice(0, 16)) if (!metadata[slug] || 'locales' in metadata[slug]) throw new Error(`Legacy metadata immutability failure: ${slug}`);
if (!source.includes("defaultLocale: 'th'")) throw new Error('Valentine Thai fallback is missing');
if (!source.includes("step1Id: step1Id as 'h1' | 'd1'")) throw new Error('Neutral four-tuple matrix is missing');
console.log('Product asset validation passed: catalog identity, 16 legacy entries, 2 Valentine asset sets.');
