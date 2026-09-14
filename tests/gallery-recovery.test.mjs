import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import jpegJs from 'jpeg-js';
import { isJpeg, prepareGallery } from '../scripts/prepare-gallery.mjs';
import { pushGalleryCommit } from '../scripts/reconcile-gallery-push.mjs';

const jpeg = Buffer.from(jpegJs.encode({ data: Buffer.alloc(256 * 256 * 4, 255), width: 256, height: 256 }, 80).data);
const html = Buffer.from('<html>expired</html>');

async function fixture(items) {
  const root = await mkdtemp(join(tmpdir(), 'gallery-recovery-test-'));
  const manifest = join(root, 'facebook-gallery.json');
  const gallery = join(root, 'public', 'gallery');
  await mkdir(gallery, { recursive: true });
  await writeFile(manifest, `${JSON.stringify(items, null, 2)}\n`);
  return { root, manifest, gallery };
}

function item(id = 'fb-123-1', url = 'https://example.test/image.jpg') { return { id, afterImage: url }; }
function response(body, status = 200) { return { ok: status >= 200 && status < 300, status, headers: new Headers(), arrayBuffer: async () => body }; }

test('reuses a valid cache without network access', async () => {
  const setup = await fixture([item()]);
  await writeFile(join(setup.gallery, 'fb-123-1.jpg'), jpeg);
  const result = await prepareGallery({ galleryPath: setup.manifest, galleryDir: setup.gallery, fetchImpl: async () => assert.fail('must not fetch') });
  assert.deepEqual(result, { cached: 1, downloaded: 0, total: 1 });
  assert.equal(JSON.parse(await readFile(setup.manifest)).at(0).afterImage, '/gallery/fb-123-1.jpg');
});

test('rejects HTML, partial JPEGs, and HTTP errors without changing the manifest', async () => {
  for (const fetched of [response(html), response(jpeg.subarray(0, -2)), response(html, 403)]) {
    const setup = await fixture([item()]); const before = await readFile(setup.manifest, 'utf8');
    await assert.rejects(prepareGallery({ galleryPath: setup.manifest, galleryDir: setup.gallery, retries: 1, fetchImpl: async () => fetched }));
    assert.equal(await readFile(setup.manifest, 'utf8'), before);
  }
});

test('rejects arbitrary data wrapped in JPEG markers', () => {
  const junk = Buffer.concat([Buffer.from([0xff, 0xd8]), Buffer.alloc(1_100, 7), Buffer.from([0xff, 0xd9])]);
  assert.equal(isJpeg(junk), false);
});

test('keeps the manifest atomic when a later download fails', async () => {
  const setup = await fixture([item('fb-123-1'), item('fb-456-2')]); const before = await readFile(setup.manifest, 'utf8'); let calls = 0;
  await assert.rejects(prepareGallery({ galleryPath: setup.manifest, galleryDir: setup.gallery, retries: 1, fetchImpl: async () => response(++calls === 1 ? jpeg : html) }));
  assert.equal(await readFile(setup.manifest, 'utf8'), before);
});

test('rejects duplicate IDs before any network request', async () => {
  const setup = await fixture([item('fb-123-1'), item('fb-123-1')]);
  await assert.rejects(prepareGallery({ galleryPath: setup.manifest, galleryDir: setup.gallery, fetchImpl: async () => assert.fail('must not fetch') }), /Duplicate gallery id/);
});

function git(cwd, ...args) { return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim(); }
async function gitFixture() {
  const root = await mkdtemp(join(tmpdir(), 'gallery-git-test-')); const remote = join(root, 'remote.git'); const a = join(root, 'a'); const b = join(root, 'b');
  git(root, 'init', '--bare', remote); git(root, 'clone', remote, a); git(a, 'config', 'user.email', 'test@example.test'); git(a, 'config', 'user.name', 'test');
  await mkdir(join(a, 'src', 'data'), { recursive: true }); await mkdir(join(a, 'public', 'gallery'), { recursive: true });
  await writeFile(join(a, 'src/data/facebook-gallery.json'), '[]\n'); await writeFile(join(a, 'README.md'), 'base\n');
  git(a, 'add', '.'); git(a, 'commit', '-m', 'base'); git(a, 'branch', '-M', 'main'); git(a, 'push', '-u', 'origin', 'main');
  git(root, 'clone', remote, b); git(b, 'checkout', 'main'); git(b, 'config', 'user.email', 'test@example.test'); git(b, 'config', 'user.name', 'test');
  assert.equal(git(a, 'remote', 'get-url', 'origin'), remote);
  return { a, b };
}

test('retries a non-fast-forward caused by an unrelated push', async () => {
  const { a, b } = await gitFixture(); const base = git(a, 'rev-parse', 'HEAD');
  await writeFile(join(a, 'public/gallery/fb-123-1.jpg'), jpeg); await writeFile(join(a, 'src/data/facebook-gallery.json'), '[{"id":"fb-123-1","afterImage":"/gallery/fb-123-1.jpg"}]\n'); git(a, 'add', '.'); git(a, 'commit', '-m', 'recover');
  await writeFile(join(b, 'README.md'), 'unrelated\n'); git(b, 'add', '.'); git(b, 'commit', '-m', 'unrelated'); git(b, 'push');
  assert.equal(pushGalleryCommit({ base, cwd: a }).attempts, 2); assert.match(git(a, 'show', 'origin/main:README.md'), /unrelated/);
});

test('requires an explicit clone directory for push reconciliation', () => {
  assert.throws(() => pushGalleryCommit({ base: 'test-base' }), /explicit git working directory/);
});

test('preserves a newer remote gallery update rather than overwriting it', async () => {
  const { a, b } = await gitFixture(); const base = git(a, 'rev-parse', 'HEAD');
  await writeFile(join(a, 'src/data/facebook-gallery.json'), '[{"id":"fb-123-1","afterImage":"/gallery/fb-123-1.jpg"}]\n'); git(a, 'add', '.'); git(a, 'commit', '-m', 'recover');
  await writeFile(join(b, 'src/data/facebook-gallery.json'), '[{"id":"fb-new-1","afterImage":"/gallery/fb-new-1.jpg"}]\n'); git(b, 'add', '.'); git(b, 'commit', '-m', 'new gallery'); git(b, 'push');
  assert.throws(() => pushGalleryCommit({ base, cwd: a }), /refusing to overwrite newer gallery updates/); assert.match(git(a, 'show', 'origin/main:src/data/facebook-gallery.json'), /fb-new-1/);
});
