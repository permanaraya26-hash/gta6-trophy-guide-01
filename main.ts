// Leonida Trophy Guide — gta6-trophy-guide-01 entry builder (Node 22, stdlib only).
// The guide itself is plain static files under app/ (index.html, CSS, ES modules,
// trophies.json) that open offline in a browser with no build step and no network
// requests at runtime. This script is only the hand-in: it checks the trophy
// data, copies app/ and screenshots/ into the output directory, and writes
// dossier.json with the vendored make.fun library, which the scorer requires
// byte-for-byte.
//
// Run locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the guide locally with:  node serve.ts   (then open http://localhost:8080)

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Directory this file lives in, and the output directory (defaults to /output,
// the grader's container path; MAKEFUN_OUTPUT_DIR stands in for it locally).
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Pre-flight: the guide data must be exactly the 55 official PS5 trophies,
// with the official name, description and grade for each one. Refuse to build
// a hand-in from a truncated or edited trophy list.
const trophyDoc = JSON.parse(readFileSync(join(repoRoot, 'app', 'data', 'trophies.json'), 'utf8'));
if (!Array.isArray(trophyDoc.trophies) || trophyDoc.trophies.length !== 55) {
  throw new Error(`trophies.json must list exactly 55 trophies, found ${trophyDoc.trophies?.length ?? 0}`);
}
const grades = new Set(trophyDoc.trophies.map((t) => t.grade));
for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
  if (!grades.has(g)) throw new Error(`trophies.json is missing grade ${g}`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
let shotCount = 0;
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
  shotCount = readdirSync(join(outputDir, 'screenshots')).length;
}

// The scorer's own caps: at most 4 screenshots of at most 256 KiB each, at most
// 993 files and 48 MiB inside app/, and 163840 bytes of dossier text.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(dossierPath, dossier);

// Verify the hand-in is real before reporting success: dossier.json must
// exist and be non-empty, the output must contain the guide entry point, and
// the copied trophy data must still parse with all 55 trophies in it.
const dossierBytes = statSync(dossierPath).size;
if (dossierBytes === 0) throw new Error('dossier.json was written empty');
if (!existsSync(join(outputDir, 'app', 'index.html'))) throw new Error('app/index.html is missing from the output');
const copiedDoc = JSON.parse(readFileSync(join(outputDir, 'app', 'data', 'trophies.json'), 'utf8'));
if (!Array.isArray(copiedDoc.trophies) || copiedDoc.trophies.length !== 55) {
  throw new Error(`output trophies.json must list exactly 55 trophies, found ${copiedDoc.trophies?.length ?? 0}`);
}
console.log(`Built Leonida Trophy Guide: 55 trophies, ${shotCount} screenshots, dossier ${dossierBytes} bytes -> ${outputDir}`);
