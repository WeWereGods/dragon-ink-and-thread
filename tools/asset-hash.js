/* Dragon Ink and Thread — content-hash cache busting.
   ============================================================================
   WHY THIS EXISTS: three separate times, css/styles.css was edited and its
   ?v= token was NOT bumped, so returning visitors kept the cached stylesheet.
   The worst of them shipped a fabric lightbox whose CSS nobody could load —
   the enlarged photo appeared full-size over the page with no backdrop.

   A hand-maintained version number fails because it relies on remembering.
   This derives the token from the FILE'S OWN CONTENTS, so it changes exactly
   when the file changes and never when it doesn't. Nothing to remember.

     css/styles.css?v=a1b2c3d4   <- first 8 chars of its sha1

   USE: node tools/bump-assets.js   (rewrites every ?v= in every .html)
   The two page generators call hashOf() directly, so generated pages come out
   already stamped correctly. */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const cache = new Map();

/* Short content hash for a repo-relative asset path ("css/styles.css").
   Returns null if the file doesn't exist, so a stray reference is visible
   rather than silently stamped with something meaningless. */
function hashOf(rel) {
  if (cache.has(rel)) return cache.get(rel);
  const full = path.join(ROOT, rel);
  let h = null;
  if (fs.existsSync(full)) {
    h = crypto.createHash("sha1").update(fs.readFileSync(full)).digest("hex").slice(0, 8);
  }
  cache.set(rel, h);
  return h;
}

module.exports = { hashOf, ROOT };
