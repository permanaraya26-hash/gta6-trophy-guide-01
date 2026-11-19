// Leonida Trophy Guide — the entry program (Node 22, standard library only).
// It hands the guide in: copies app/ and screenshots/ from beside this file
// to /output and writes /output/dossier.json with the vendored make.fun
// library. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Before copying it runs a pre-flight check of its own, so a broken guide
// fails loudly here instead of silently reaching the grader.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const trophyFile = join(here, 'app', 'data', 'trophies.json');
const indexFile = join(here, 'app', 'index.html');
const shotDir = join(here, 'screenshots');

// Pre-flight: the trophy list must parse, hold all 55 trophies, and use
// only the four grades PlayStation publishes for this game.
const trophies = JSON.parse(readFileSync(trophyFile, 'utf8')).trophies;
if (!Array.isArray(trophies) || trophies.length !== 55) {
  throw new Error(`Pre-flight failed: expected 55 trophies, found ${Array.isArray(trophies) ? trophies.length : 'no list'}.`);
}
const grades = new Set(trophies.map((trophy) => trophy.grade));
for (const grade of grades) {
  if (!['platinum', 'gold', 'silver', 'bronze'].includes(grade)) {
    throw new Error(`Pre-flight failed: unknown grade ${grade}.`);
  }
}
if (!existsSync(indexFile)) throw new Error('Pre-flight failed: app/index.html is missing.');
const shots = existsSync(shotDir)
  ? readdirSync(shotDir).filter((name) => statSync(join(shotDir, name)).isFile())
  : [];
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`Pre-flight failed: expected 3 or 4 screenshots, found ${shots.length}.`);
}
for (const shot of shots) {
  const size = statSync(join(shotDir, shot)).size;
  if (size > 262144) {
    throw new Error(`Pre-flight failed: screenshot ${shot} is ${size} bytes, over the 256 KiB cap.`);
  }
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(shotDir)) cpSync(shotDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps: only text_max_bytes shapes the bytes; the others
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 48 MiB).
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(out, 'dossier.json'), dossier);

// Post-flight: the dossier must be written, and the copied trophy list
// must still parse with all 55 trophies in it.
if (statSync(join(out, 'dossier.json')).size === 0) {
  throw new Error('Post-flight failed: dossier.json is empty.');
}
const copied = JSON.parse(readFileSync(join(out, 'app', 'data', 'trophies.json'), 'utf8')).trophies;
if (!Array.isArray(copied) || copied.length !== 55) {
  throw new Error('Post-flight failed: the copied trophies.json lost trophies.');
}
console.log(`Built Leonida Trophy Guide: 55 trophies, ${shots.length} screenshots, dossier ${dossier.length} bytes`);
