import { copyFile, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import jpeg from 'jpeg-js';

const MIN_JPEG_BYTES = 1_024;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 16 * 1024 * 1024;
const MAX_DECODE_MEMORY_MB = 64;
const ID_PATTERN = /^fb-[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function isInside(root, target) {
  const rel = relative(root, target);
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !rel.startsWith('..');
}

export function galleryAssetPath(galleryDir, id) {
  if (!ID_PATTERN.test(id)) throw new Error(`Unsafe gallery id: ${id}`);
  const root = resolve(galleryDir);
  const target = resolve(root, `${id}.jpg`);
  if (!isInside(root, target)) throw new Error(`Gallery asset escapes directory: ${id}`);
  return target;
}

export function isJpeg(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < MIN_JPEG_BYTES || buffer.length > MAX_IMAGE_BYTES
    || buffer[0] !== 0xff || buffer[1] !== 0xd8
    || buffer[buffer.length - 2] !== 0xff || buffer[buffer.length - 1] !== 0xd9) return false;
  try {
    const decoded = jpeg.decode(buffer, {
      useTArray: true,
      maxMemoryUsageInMB: MAX_DECODE_MEMORY_MB,
      maxResolutionInMP: MAX_IMAGE_PIXELS / (1024 * 1024),
    });
    return Number.isSafeInteger(decoded.width) && Number.isSafeInteger(decoded.height)
      && decoded.width > 0 && decoded.height > 0
      && decoded.width * decoded.height <= MAX_IMAGE_PIXELS
      && decoded.data?.length === decoded.width * decoded.height * 4;
  } catch {
    return false;
  }
}

export async function hasValidJpeg(path) {
  try {
    return isJpeg(await readFile(path));
  } catch {
    return false;
  }
}

async function fetchJpeg(url, fetchImpl, { timeoutMs, retries }) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(`Unsupported gallery URL protocol: ${parsed.protocol}`);
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(parsed, { signal: controller.signal, redirect: 'follow', credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const length = Number(response.headers?.get?.('content-length') || 0);
      if (length > MAX_IMAGE_BYTES) throw new Error(`Image exceeds ${MAX_IMAGE_BYTES} byte limit`);
      const body = Buffer.from(await response.arrayBuffer());
      if (body.length > MAX_IMAGE_BYTES || !isJpeg(body)) throw new Error('Response is not a complete JPEG image');
      return body;
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolveDelay) => setTimeout(resolveDelay, 100 * attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

/**
 * Converts every Facebook gallery record only after every target image is a valid local JPEG.
 * Files are staged first and the JSON manifest is never written on a partial failure.
 */
export async function prepareGallery({
  galleryPath = 'src/data/facebook-gallery.json',
  galleryDir = 'public/gallery',
  stagingRoot = join(tmpdir(), '57tb-gallery-recovery'),
  fetchImpl = globalThis.fetch,
  timeoutMs = 20_000,
  retries = 3,
  keepStaging = false,
} = {}) {
  const manifestPath = resolve(galleryPath);
  const assetRoot = resolve(galleryDir);
  const original = await readFile(manifestPath, 'utf8');
  const items = JSON.parse(original);
  if (!Array.isArray(items)) throw new Error('Gallery manifest must be an array');
  const ids = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || typeof item.afterImage !== 'string') throw new Error('Gallery record requires string id and afterImage');
    if (ids.has(item.id)) throw new Error(`Duplicate gallery id: ${item.id}`);
    ids.add(item.id);
  }
  await mkdir(assetRoot, { recursive: true });
  await mkdir(stagingRoot, { recursive: true });
  const stage = await mkdtemp(join(resolve(stagingRoot), 'gallery-'));
  const downloaded = [];
  let cached = 0;

  try {
    for (const item of items) {
      const destination = galleryAssetPath(assetRoot, item.id);
      if (await hasValidJpeg(destination)) {
        cached++;
      } else {
        if (!/^https?:\/\//i.test(item.afterImage)) throw new Error(`Missing valid local gallery asset: ${item.id}`);
        const image = await fetchJpeg(item.afterImage, fetchImpl, { timeoutMs, retries });
        await writeFile(join(stage, `${item.id}.jpg`), image, { flag: 'wx' });
        downloaded.push({ id: item.id, destination });
      }
      item.afterImage = `/gallery/${item.id}.jpg`;
    }

    for (const file of downloaded) {
      const staged = join(stage, `${file.id}.jpg`);
      const destinationTemp = join(dirname(file.destination), `.${file.id}.${process.pid}.tmp`);
      await copyFile(staged, destinationTemp);
      await rename(destinationTemp, file.destination);
    }
    const next = `${JSON.stringify(items, null, 2)}\n`;
    const manifestTemp = join(dirname(manifestPath), `.facebook-gallery.${process.pid}.tmp`);
    await writeFile(manifestTemp, next, { flag: 'wx' });
    await rename(manifestTemp, manifestPath);
    return { cached, downloaded: downloaded.length, total: items.length };
  } finally {
    if (!keepStaging) await rm(stage, { recursive: true, force: true });
  }
}

async function main() {
  const result = await prepareGallery({
    galleryPath: process.env.GALLERY_MANIFEST || 'src/data/facebook-gallery.json',
    galleryDir: process.env.GALLERY_DIR || 'public/gallery',
    stagingRoot: process.env.GALLERY_STAGING_DIR || join(tmpdir(), '57tb-gallery-recovery'),
    keepStaging: process.env.GALLERY_KEEP_STAGING === '1',
  });
  console.log(`Gallery prepared: ${result.cached} cached, ${result.downloaded} downloaded, ${result.total} total.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Gallery preparation failed: ${error.message}`);
    process.exitCode = 1;
  });
}
