/**
 * copy-webviewer-assets.mjs
 *
 * WHY THIS EXISTS
 * Apryse WebViewer does all document processing in the browser. To do that it
 * needs its worker, engine and UI files served as static assets from your own
 * origin. They ship inside the npm package at:
 *
 *   node_modules/@pdftron/webviewer/public
 *
 * This script copies that folder to:
 *
 *   public/lib/webviewer
 *
 * Vite serves everything in /public at the site root, so WebViewer can then be
 * initialized with `path: '/lib/webviewer'` (see src/config.ts).
 *
 * It runs automatically after `npm install` (the "postinstall" script in
 * package.json). Run it by hand with: `node scripts/copy-webviewer-assets.mjs`
 *
 * NOTE: Apryse used to be called PDFTron, which is why the package is named
 * @pdftron/webviewer.
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'node_modules/@pdftron/webviewer/public');
const target = resolve(root, 'public/lib/webviewer');

if (!existsSync(source)) {
  console.error(`[copy-webviewer-assets] Not found: ${source}\nRun "npm install" first.`);
  process.exit(1);
}

// Remove any previous copy so an upgrade never mixes files from two versions.
rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
console.log(`[copy-webviewer-assets] Copied WebViewer static assets to ${target}`);
