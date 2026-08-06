/* Dragon Ink and Thread — bring new fabric photos into the library.
   ============================================================================
   RUN IT:  node tools/import-fabrics.js <folder-of-new-photos>
   e.g.     node tools/import-fabrics.js assets/incoming

   WHAT IT DOES, for every image in that folder:
     1. Bakes in EXIF rotation, resizes to 640px on the long edge, re-encodes
        at quality 78 (~81 KB) — the same treatment the first 53 had.
     2. Writes it to assets/fabrics/ as the next free fabric-NN.jpg.
     3. Adds it to js/fabrics-data.js in a holding group, with the original
        filename as a placeholder name.

   WHY STEP 3 EXISTS: tools/rename-fabrics.html only draws fabrics that are
   already in js/fabrics-data.js. A photo sitting in a folder never appears
   there, so importing by hand meant typing entries blind for files you
   couldn't see. Now the import puts them on screen, and you do the naming and
   the grouping in the tool, looking at the pictures.

   AFTER THIS RUNS:
     1. Open tools/rename-fabrics.html — the new ones are at the bottom under
        "Unsorted". Type each real name, and use the dropdown to move it into
        the group it belongs in.
     2. Download fabrics-data.js and drop it into js/, replacing the old one.
     3. node tools/build-fabrics.js  &&  node tools/bump-assets.js
     4. Commit and push.

   The holding group disappears on its own once every fabric has been moved
   out of it — an empty group is dropped when the file is written back.

   NEEDS sharp, which is NOT a dependency of this site (it has none). Install
   it once with:  npm install sharp
   node_modules/ is already gitignored, so nothing about the site changes.

   Raw phone originals must NEVER be committed — 53 of them was 188 MB. Keep
   them somewhere gitignored (assets/Catalog/) or off the repo entirely.
*/
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FABRIC_DIR = path.join(ROOT, "assets", "fabrics");
const DATA_FILE = path.join(ROOT, "js", "fabrics-data.js");
const HOLDING = "Unsorted — name these";

const LONG_EDGE = 640;
const QUALITY = 78;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

function die(msg) {
  console.error("\n" + msg + "\n");
  process.exit(1);
}

let sharp;
try {
  sharp = require("sharp");
} catch {
  die(
    "This script needs sharp, which isn't installed.\n\n" +
      "  npm install sharp\n\n" +
      "Run that from the repo root, then try again. node_modules/ is gitignored,\n" +
      "so it won't end up in the site."
  );
}

/* ---- where the new photos are ------------------------------------------- */

const srcArg = process.argv[2];
if (!srcArg) {
  die(
    "Tell me which folder the new photos are in:\n\n" +
      "  node tools/import-fabrics.js assets/incoming\n\n" +
      "Point it at a folder holding ONLY the new fabric photos — not assets/\n" +
      "itself, which is full of product shots."
  );
}

const SRC = path.resolve(ROOT, srcArg);
if (!fs.existsSync(SRC) || !fs.statSync(SRC).isDirectory()) {
  die("There's no folder at:\n\n  " + SRC);
}
if (path.resolve(SRC) === path.resolve(FABRIC_DIR)) {
  die("That's the fabric library itself. Point me at the folder of NEW photos.");
}
if (path.resolve(SRC) === path.resolve(ROOT, "assets")) {
  die(
    "assets/ holds every product photo on the site, not just fabric.\n" +
      "Move the new fabric photos into a folder of their own first, e.g.\n" +
      "assets/incoming/, and point me at that."
  );
}

const sources = fs
  .readdirSync(SRC)
  .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

if (!sources.length) die("No images in:\n\n  " + SRC);

/* ---- read the library, find the next free number ------------------------ */

global.window = {};
require(DATA_FILE);
const GROUPS = global.window.DIT_FABRICS.GROUPS;

const taken = new Set(
  GROUPS.flatMap((g) => g.items.map((it) => it.file))
);
let next = 0;
for (const f of fs.readdirSync(FABRIC_DIR)) {
  const m = /^fabric-(\d+)\.jpg$/i.exec(f);
  if (m) next = Math.max(next, parseInt(m[1], 10));
}
next += 1;

const pad = (n) => String(n).padStart(2, "0");

/* ---- process ------------------------------------------------------------ */

(async () => {
  const added = [];

  for (const src of sources) {
    let file;
    do {
      file = "fabric-" + pad(next++) + ".jpg";
    } while (taken.has(file) || fs.existsSync(path.join(FABRIC_DIR, file)));
    taken.add(file);

    await sharp(path.join(SRC, src))
      .rotate() // applies EXIF orientation, then re-encoding drops the tag
      .resize(LONG_EDGE, LONG_EDGE, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: QUALITY })
      .toFile(path.join(FABRIC_DIR, file));

    const kb = Math.round(fs.statSync(path.join(FABRIC_DIR, file)).size / 1024);
    added.push({ file, name: path.basename(src, path.extname(src)), src, kb });
    console.log("  " + src.padEnd(34) + " →  " + file + "  (" + kb + " KB)");
  }

  /* ---- write them into the library ------------------------------------- */

  let holding = GROUPS.find((g) => g.label === HOLDING);
  if (!holding) {
    holding = { label: HOLDING, note: "Just imported — give these their names.", items: [] };
    GROUPS.push(holding);
  }
  holding.items.push(...added.map((a) => ({ file: a.file, name: a.name })));

  fs.writeFileSync(DATA_FILE, serialize(GROUPS.filter((g) => g.items.length)), "utf8");

  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
  console.log(
    "\nImported " + added.length + " — the library is now " + total + " fabrics.\n\n" +
      "NEXT: open tools/rename-fabrics.html. The new ones are at the bottom under\n" +
      '"' + HOLDING + '". Name each one and move it into its group, download the\n' +
      "file into js/, then:\n\n" +
      "  node tools/build-fabrics.js && node tools/bump-assets.js\n"
  );
})().catch((err) => die(err && err.message ? err.message : String(err)));

/* Same shape tools/rename-fabrics.html writes, so the file round-trips
   through either one without churning the diff. */
function serialize(groups) {
  let out =
    "/* Dragon Ink and Thread — the fabric library (single source of truth).\n" +
    "   ===========================================================================\n" +
    "   Written by tools/rename-fabrics.html. See that file, or the notes below.\n" +
    "\n" +
    "   ADD A FABRIC:\n" +
    "     1. Put the photo in assets/fabrics/ (see the note on processing below)\n" +
    "     2. Add a { file, name } entry to the right group here\n" +
    "     3. node tools/build-fabrics.js     (regenerates fabrics.html)\n" +
    "     4. node tools/bump-assets.js       (restamps cache tokens)\n" +
    "\n" +
    "   A FOLDER OF NEW PHOTOS: node tools/import-fabrics.js <folder> does all of\n" +
    "   that for you — resize, rotate, number, and add them here to be named.\n" +
    "\n" +
    "   REMOVE ONE when the bolt runs out: delete its entry and re-run. Better to\n" +
    "   remove it than to have someone fall in love with fabric you no longer have.\n" +
    "\n" +
    "   PHOTO PROCESSING — the originals are 3-7 MB phone JPEGs and must NOT be\n" +
    "   committed raw (53 of them was 188 MB). They're resized to 640px on the long\n" +
    "   edge at quality 78 (~81 KB each) and re-encoded, which also strips EXIF.\n" +
    "   That last part matters: 5 of these were shot in landscape with an EXIF\n" +
    "   orientation tag, and without baking the rotation into the pixels they\n" +
    "   display on their side. Jimp v1 auto-rotates on read; re-encoding drops the\n" +
    "   tag so nothing rotates them a second time. */\n" +
    "window.DIT_FABRICS = {\n  GROUPS: [\n";
  out += groups
    .map(
      (g) =>
        "    {\n      label: " + JSON.stringify(g.label) + ",\n" +
        (g.note ? "      note: " + JSON.stringify(g.note) + ",\n" : "") +
        "      items: [\n" +
        g.items
          .map(
            (it) =>
              "        { file: " + JSON.stringify(it.file) +
              ", name: " + JSON.stringify(it.name) + " }"
          )
          .join(",\n") +
        "\n      ]\n    }"
    )
    .join(",\n");
  out += "\n  ]\n};\n";
  return out;
}
