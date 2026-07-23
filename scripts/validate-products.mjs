import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const publicProducts = join(root, 'public/products');
const metadata = JSON.parse(readFileSync(join(root, 'src/data/products-images.json'), 'utf8'));
const valentine = {
  'valentine-magic-straight-system': { hero: [1500, 1050], galleryGroups: ['h1', 'd1', 'c2', 'l2'] },
  'valentine-lpp-treatment': { hero: [1100, 1100], galleryGroups: ['gallery'] },
};

function dimensions(file) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const numbers = [...output.matchAll(/pixel(?:Width|Height):\s+(\d+)/g)].map((match) => Number(match[1]));
  if (numbers.length !== 2 || numbers.some((value) => value < 1)) throw new Error(`Unreadable image: ${file}`);
  return { width: numbers[0], height: numbers[1] };
}

for (const [slug, spec] of Object.entries(valentine)) {
  const base = join(publicProducts, slug);
  const expected = ['hero.webp', 'thumb.webp'];
  for (const group of spec.galleryGroups) for (const prefix of ['main', 'desc']) {
    const count = prefix === 'main' ? 8 : 6;
    for (let index = 1; index <= count; index++) expected.push(`${group}/${prefix}-${String(index).padStart(2, '0')}.webp`);
  }
  const actual = [];
  for (const entry of readdirSync(base, { recursive: true })) {
    const path = join(base, entry);
    if (statSync(path).isFile()) actual.push(entry);
  }
  actual.sort(); expected.sort();
  if (actual.join('|') !== expected.join('|')) throw new Error(`${slug}: unexpected asset set (${actual.join(', ')})`);
  let transfer = 0;
  let galleryTransfer = 0;
  for (const file of expected) {
    const path = join(base, file);
    if (!existsSync(path)) throw new Error(`${slug}: missing ${file}`);
    const size = statSync(path).size;
    if (file === 'thumb.webp' && size > 250_000) throw new Error(`${slug}: thumbnail exceeds 250KB`);
    if (file === 'hero.webp' && size > 650_000) throw new Error(`${slug}: hero exceeds 650KB`);
    if (file.includes('/main-') && size > 180_000) throw new Error(`${slug}: main gallery visual exceeds 180KB`);
    if (file.includes('/desc-') && size > 220_000) throw new Error(`${slug}: detail gallery visual exceeds 220KB`);
    transfer += size;
    const decoded = dimensions(path);
    if (file === 'hero.webp' && (decoded.width !== spec.hero[0] || decoded.height !== spec.hero[1])) throw new Error(`${slug}: hero dimensions are ${decoded.width}x${decoded.height}`);
    if (file.includes('/main-') && (decoded.width !== 1080 || decoded.height !== 1080)) throw new Error(`${slug}: main gallery dimensions are ${decoded.width}x${decoded.height}`);
    if (file.includes('/desc-') && (decoded.width !== 1080 || decoded.height !== 1350)) throw new Error(`${slug}: detail gallery dimensions are ${decoded.width}x${decoded.height}`);
    if (file.includes('/')) galleryTransfer += size;
  }
  if (galleryTransfer > 2_200_000) throw new Error(`${slug}: gallery transfer exceeds 2.2MB`);
  if (transfer > 2_700_000) throw new Error(`${slug}: total Valentine image transfer exceeds 2.7MB`);
  const chunks = metadata[slug]?.locales?.th?.chunks;
  if (!Array.isArray(chunks) || chunks.length !== 1 || chunks[0].file !== 'hero.webp') throw new Error(`${slug}: image metadata must contain one Thai hero`);
}

const source = readFileSync(join(root, 'src/data/products.ts'), 'utf8');
const magicDetailSource = readFileSync(join(root, 'src/components/products/ValentineProductDetail.tsx'), 'utf8');
const multiPermRequired = [
  'Valentine Professional น้ำยา Multi Perm',
  'Valentine Professional Multi Perm System',
  'Valentine Professional 멀티펌 시스템',
  'น้ำยายืดผมและน้ำยาดัดผมอเนกประสงค์สำหรับงานซาลอน',
  'ใช้ได้ทั้งดัดดิจิตอล ยืดวอลลุ่ม (วอลลุ่มเมจิก) และรีบอนดิ้ง',
];
const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
if (new Set(slugs).size !== slugs.length) throw new Error('Catalog has duplicate slugs');
if (slugs.length !== 18) throw new Error(`Catalog identity mismatch: expected 18 products, found ${slugs.length}`);
for (const slug of slugs.slice(0, 16)) if (!metadata[slug] || 'locales' in metadata[slug]) throw new Error(`Legacy metadata immutability failure: ${slug}`);
if (!source.includes("defaultLocale: 'th'")) throw new Error('Valentine Thai fallback is missing');
if (!source.includes("step1Id: step1Id as 'h1' | 'd1'")) throw new Error('Neutral four-tuple matrix is missing');
if (multiPermRequired.some((copy) => !source.includes(copy))) throw new Error('Multi Perm catalog terminology is incomplete');
if (!source.includes("น้ำยา Multi Perm ขั้นตอนที่ 1 สูตรสำหรับผมสุขภาพดี") || !source.includes("น้ำยา Multi Perm ขั้นตอนที่ 1 สูตรสำหรับผมเสีย")) throw new Error('Multi Perm Step 1 roles are incomplete');
if (!magicDetailSource.includes('น้ำยา Multi Perm<br />2 ขั้นตอน<br />สำหรับช่างมืออาชีพ') || !magicDetailSource.includes('STAGE 1 · MULTI PERM CREAM')) throw new Error('Multi Perm detail hierarchy is incomplete');
console.log('Product asset validation passed: catalog identity, 16 legacy entries, and exact 70 Valentine Shopee gallery assets.');
