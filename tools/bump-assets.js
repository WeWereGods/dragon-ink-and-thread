/* Dragon Ink and Thread — stamp every asset link with its content hash.
   ============================================================================
   RUN IT:  node tools/bump-assets.js

   Rewrites every  css/*.css?v=…  and  js/*.js?v=…  in every .html at the repo
   root so the token is the first 8 chars of that file's sha1. Run it after
   touching any CSS or JS and before committing — or just run it always, it's
   idempotent and prints nothing but a summary when there's no change.

   See tools/asset-hash.js for why this replaces the old hand-typed version.
*/
"use strict";

const fs = require("fs");
const path = require("path");
const { hashOf, ROOT } = require("./asset-hash");

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const RE = /(?:href|src)="((?:css|js)\/[A-Za-z0-9._-]+\.(?:css|js))\?v=[^"]*"/g;

let changedFiles = 0, stamped = 0;
const missing = new Set();

for (const f of files) {
  const p = path.join(ROOT, f);
  const before = fs.readFileSync(p, "utf8");
  const after = before.replace(RE, (m, asset) => {
    const h = hashOf(asset);
    if (!h) { missing.add(asset); return m; }
    stamped++;
    return m.replace(/\?v=[^"]*"/, `?v=${h}"`);
  });
  if (after !== before) { fs.writeFileSync(p, after); changedFiles++; }
}

console.log(`Stamped ${stamped} asset links across ${files.length} pages (${changedFiles} rewritten).`);
for (const a of missing) console.warn(`  ! referenced but not found: ${a}`);

// Show what each asset resolved to, so a wrong hash is obvious at a glance.
const seen = new Set();
for (const f of files) {
  const s = fs.readFileSync(path.join(ROOT, f), "utf8");
  let m;
  const re = new RegExp(RE.source, "g");
  while ((m = re.exec(s))) if (!seen.has(m[1])) { seen.add(m[1]); }
}
[...seen].sort().forEach((a) => console.log(`  ${a.padEnd(22)} ?v=${hashOf(a)}`));
