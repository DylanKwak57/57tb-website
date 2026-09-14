import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const GALLERY_PATHS = ['src/data/facebook-gallery.json', 'public/gallery'];

function git(args, { allowFailure = false, cwd } = {}) {
  if (!cwd) throw new Error('An explicit git working directory is required');
  const result = spawnSync('git', args, { encoding: 'utf8', cwd });
  if (result.status !== 0 && !allowFailure) throw new Error(`git ${args.join(' ')} failed: ${result.stderr.trim()}`);
  return result;
}

export function pushGalleryCommit({ base, branch = 'main', attempts = 3, cwd } = {}) {
  if (!base) throw new Error('A pre-recovery base SHA is required');
  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (git(['push', 'origin', `HEAD:${branch}`], { allowFailure: true, cwd }).status === 0) return { attempts: attempt };
    git(['fetch', 'origin', branch], { cwd });
    if (git(['diff', '--quiet', `${base}..origin/${branch}`, '--', ...GALLERY_PATHS], { allowFailure: true, cwd }).status !== 0) {
      throw new Error('Remote gallery changed during recovery; refusing to overwrite newer gallery updates.');
    }
    const rebase = git(['rebase', `origin/${branch}`], { allowFailure: true, cwd });
    if (rebase.status !== 0) {
      git(['rebase', '--abort'], { allowFailure: true, cwd });
      throw new Error(`Could not rebase recovery commit safely: ${rebase.stderr.trim()}`);
    }
  }
  throw new Error(`Gallery recovery push still failed after ${attempts} bounded attempts.`);
}

function main() {
  const baseIndex = process.argv.indexOf('--base');
  const base = baseIndex >= 0 ? process.argv[baseIndex + 1] : undefined;
  const result = pushGalleryCommit({ base, cwd: process.cwd() });
  console.log(`Gallery recovery pushed after ${result.attempts} attempt(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
