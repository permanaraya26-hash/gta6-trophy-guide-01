// Leonida Trophy Guide — gta6-trophy-guide-01 entry builder (Node 22, stdlib only).
// The guide itself is plain static files under app/ (index.html, CSS, ES modules,
// trophies.json) that open offline in a browser with no build step and no network
// requests at runtime. This script is only the hand-in: it copies app/ and
// screenshots/ into the output directory and writes dossier.json with the
// vendored make.fun library, which the scorer requires byte-for-byte.
//
// Run locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the guide locally with:  node serve.ts   (then open http://localhost:8080)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Directory this file lives in, and the output directory (defaults to /output,
// the grader's container path; MAKEFUN_OUTPUT_DIR stands in for it locally).
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: at most 4 screenshots of at most 256 KiB each, at most
// 993 files and 48 MiB inside app/, and 163840 bytes of dossier text.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
