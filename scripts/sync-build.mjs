import { cp, rm, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

// Deployed GitHub Pages site is served from the repository root,
// so the finished build is mirrored there on every `npm run build`.
await rm(resolve(root, 'assets'), { recursive: true, force: true });

for (const entry of await readdir(dist)) {
  if (entry === 'src') continue;
  await cp(resolve(dist, entry), resolve(root, entry), { recursive: true, force: true });
}

console.log('Build synced to repository root (GitHub Pages).');
